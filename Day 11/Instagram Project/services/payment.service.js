const axios = require('axios');

module.exports = (logger, models) => {
    const { TempPost, Post, Profile, Order, User, Plan } = models;

    async function generateAccessToken() {
        try {
            const response = await axios({
                url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
                method: 'post',
                data: 'grant_type=client_credentials',
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_SECRET
                }
            });
            return response.data.access_token;
        } catch (e) {
            logger.error(`Generate Access Token Error: ${e.message}`);
            throw new Error(e.message);
        }
    }

    const createOrder = async (plan, tempPostId) => {
        const accessToken = await generateAccessToken();
        

        const price = plan === 'pro' ? 20 : 10;

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: tempPostId,
                    items: [{
                        name: 'Post your Creation',
                        description: "You can create posts, like, comment, and share them.",
                        unit_amount: {
                            currency_code: 'USD',
                            value: price.toFixed(2)
                        },
                        quantity: "1"
                    }],
                    amount: {
                        currency_code: 'USD',
                        value: price.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: price.toFixed(2)
                            }
                        }
                    }
                }],
                application_context: {
                    brand_name: 'InstaClone',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.BASE_URL}/api/payment/payment-success?tempPostId=${tempPostId}`,
                    cancel_url: `${process.env.BASE_URL}/api/payment/choose-plan?tempPostId=${tempPostId}`,
                    shipping_preference: 'NO_SHIPPING'
                }
            }
        });

        const approveLink = response.data.links.find(link => link.rel === 'approve');
        return {
            status: 200,
            data: {
                redirect: approveLink.href,
                orderId: response.data.id
            }
        };
        
    };

    const capturePayment = async (orderId, tempPostId) => {
        const accessToken = await generateAccessToken();

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const status = response.data.status;
        const tempPost = await TempPost.findById(tempPostId);
        const order = await Order.findOne({ tempPost: tempPostId });

        if (!order) {
            return { status: 400, message: 'Order not found' };
        }

        if (status === 'COMPLETED') {
            if (!tempPost) {
                return { status: 400, data: { message: 'Temp Post not found' } };
            }

            order.status = 'COMPLETED';
            await order.save();

            const finalPost = await Post.create({
                user: tempPost.user,
                profile: tempPost.profile,
                caption: tempPost.caption,
                media: tempPost.media,
                hashtags: tempPost.hashtags
            });

            // Create a new plan for the user
            const planName = order.planType === 'pro' ? 'pro' : 'basic';
            const price = order.planType === 'pro' ? 20 : 10;
            const user = await User.findById(tempPost.user);
            const planStartDate = new Date();
            const planEndDate = new Date();
            planEndDate.setMonth(planEndDate.getMonth() + 1); // 1 month plan

            const newPlan = await Plan.create({
                user,
                planName,
                price,
                description: planName === 'pro' ? 'You get everything in Basic, plus you can chat, reply to comments, and do more.' : 'You can create posts, like and comment.',
                planStartDate,
                planEndDate
            });

            // Update Profile with new Plan
            const profile = await Profile.findOne({ user: tempPost.user });
            profile.planName = newPlan.planName;
            profile.planStartDate = newPlan.planStartDate;
            profile.planEndDate = newPlan.planEndDate;
            await profile.save();

            await TempPost.findByIdAndDelete(tempPostId);

            return {
                status: 200,
                success: true,
                message: 'Post created successfully & Plan activated!',
                postId: finalPost._id,
                user: finalPost.user.toString()
            };
        } else {
            return { status: 400, message: 'Payment failed or not completed' };
        }
    };

    return { createOrder, capturePayment };
};
