<template>
    <div id="reset_password">
        <a-card title="Reset password" :bordered="false">
            <a-alert
                class="message"
                v-if="message.isShow"
                :message="message.text"
                :description="message.description"
                :type="message.type"
                showIcon
            />
            <a-steps :current="currentIndex">
                <a-step
                    v-for="step in steps"
                    :key="step.title"
                    :title="step.title"
                >
                    <a-icon :type="step.icon" slot="icon" />
                </a-step>
            </a-steps>
            <div class="steps-content">
                <div v-if="currentIndex === 0">
                    <h2>Reset your password.</h2>
                    <pre>

Follow the instructions on the screen.
Operation flow

① Email address input
② Send e-mail to the entered e-mail address

Thank you
                    </pre>
                </div>
                <div v-if="currentIndex === 1">
                    <a-form :form="form">
                        <a-form-item
                            v-bind="{
                                labelCol: {
                                    xs: { span: 24, offset: 0 },
                                    sm: { span: 8, offset: 0 }
                                },
                                wrapperCol: {
                                    xs: { span: 24, offset: 0 },
                                    sm: { span: 10, offset: 0 }
                                }
                            }"
                            label="Mail address"
                            :validate-status="validateStatus"
                            :help="help"
                        >
                            <a-input
                                v-decorator="[
                                    'mailAddress',
                                    {
                                        rules: [
                                            {
                                                type: 'email',
                                                message:
                                                    'The input is not valid mail address!'
                                            }
                                        ]
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-form>
                </div>
                <div v-if="currentIndex === 2">
                    <h2>Send email.</h2>
                    <pre>

An email has been sent to the entered mail address.
Please check your email and reset your password.
                    </pre>
                </div>
            </div>
            <div class="steps-action">
                <a-button
                    v-if="currentIndex < steps.length - 1"
                    type="primary"
                    @click="next"
                >
                    Next
                </a-button>
                <a-button
                    v-if="currentIndex == steps.length - 1"
                    type="primary"
                    @click="$router.push({ name: 'signIn' })"
                >
                    Done
                </a-button>
                <a-button
                    v-if="currentIndex > 0"
                    style="margin-left: 8px"
                    @click="prev"
                >
                    Previous
                </a-button>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { AppMessage } from 'ant-design-vue/types/message';

import firebaseAuth, { isFirebaseAuthError } from '@/plugins/firebase/auth';
import { resetMessage } from '@/util/reset';

@Component
export default class ResetPassword extends Vue {
    currentIndex = 0;

    steps = [
        {
            title: 'Message',
            icon: 'message'
        },
        {
            title: 'Input',
            icon: 'solution'
        },
        {
            title: 'Send email',
            icon: 'mail'
        }
    ];

    form!: WrappedFormUtils;

    validateStatus = '';

    help = '';

    tmpMailAddress = '';

    message: AppMessage = resetMessage();

    beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    isCorrectMailAddress(
        mailAddressValue: string,
        mailAddressErrors: object[]
    ) {
        this.validateStatus = '';
        this.help = '';
        this.message = resetMessage();

        if (!mailAddressValue) {
            this.validateStatus = 'error';
            this.help = 'Please input your mail address!';
            return false;
        }

        if (mailAddressErrors) {
            const [mailAddressError] = mailAddressErrors;

            this.validateStatus = 'error';
            this.help = mailAddressError.toString();
            return false;
        }

        return true;
    }

    handleResetPassword(mailAddress: string) {
        try {
            if (mailAddress !== this.tmpMailAddress) {
                firebaseAuth.resetPassword(mailAddress);
            }
            this.tmpMailAddress = mailAddress;
        } catch (err) {
            if (isFirebaseAuthError(err)) {
                this.message = {
                    isShow: true,
                    text: `Error (${err.code})`,
                    description: err.message,
                    type: 'error'
                };
            }
        }
    }

    next() {
        if (this.currentIndex === 1) {
            const mailAddressValue = this.form.getFieldValue('mailAddress');
            const mailAddressErrors = this.form.getFieldError('mailAddress');
            if (
                !this.isCorrectMailAddress(mailAddressValue, mailAddressErrors)
            ) {
                return;
            }
            this.handleResetPassword(mailAddressValue);
        }
        this.currentIndex++;
    }

    prev() {
        this.currentIndex--;
    }
}
</script>

<style scoped>
.message {
    margin-bottom: 2%;
}

#reset_password {
    background-color: #ececec;
    padding: 10% 5%;
    height: 100vh;
    width: 100vw;
}

.steps-content {
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    height: 35vh;
    min-height: 200px;
    padding-top: 20px;
    padding-left: 20px;
}

.steps-action {
    margin-top: 24px;
}
</style>
