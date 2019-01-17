<template>
    <div class="info-menu" :class="{'info-menu-light': theme === 'light'}">
        <div class="info-menu-sign-out" v-if="app.userInfo">
            <Dropdown @on-click="handleClickItem" trigger="click" class="info-menu-add-dropdown">
                <Badge :count="countUnread" :offset="[18, 2]">
                    <Avatar class="dev-header-aside-icon" :src="app.userInfo.avatar + '/avatar'" />
                </Badge>
                <DropdownMenu slot="list" class="info-menu-user">
                    <DropdownItem name="me">
                        <strong class="info-menu-user-name">{{ app.userInfo.name }}</strong>
                        <dev-vip-grade :grade="app.userInfo.vip_grade" class-name="info-menu-aside-vip"></dev-vip-grade>
                    </DropdownItem>
                    <DropdownItem name="home" divided>
                        <Icon type="ios-person-outline" class="normal"></Icon>
                        <span>我的主页</span>
                    </DropdownItem>
                    <DropdownItem name="checkmail" v-if="!app.userInfo.is_activity">
                        <Icon type="ios-mail-outline" class="normal"></Icon>
                        <Badge dot><span>验证邮箱</span></Badge>
                    </DropdownItem>
                    <DropdownItem name="notify">
                        <Icon type="ios-notifications-outline" class="normal"></Icon>
                        <span>通知</span>
                        <Badge :count="countUnread"></Badge>
                    </DropdownItem>
                    <DropdownItem name="upgrade" v-if="app.userInfo.vip_grade !== 1">
                        <Icon custom="i-info-icon i-info-icon-vip" class="normal" size="13"></Icon>
                        <span>我的会员</span>
                    </DropdownItem>
                    <DropdownItem name="upgrade" v-if="app.userInfo.vip_grade === 1">
                        <Icon custom="i-info-icon i-info-icon-vip" class="normal" size="13"></Icon>
                        <Badge dot><span>升级会员</span></Badge>
                    </DropdownItem>
                    <DropdownItem name="signout" divided>
                        <Icon type="ios-log-out" class="normal"></Icon>
                        <span>退出登录</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div class="info-menu-sign-in" @click="handleOpenSignIn" v-else>
            <Avatar icon="ios-person"></Avatar>
            <Button type="text" size="large">登录</Button>
        </div>
        <div class="info-menu-add">
            <Dropdown @on-click="handleSelectAdd" trigger="click" class="info-menu-add-dropdown">
                <Button type="text" size="large">
                    <Icon type="md-add" size="24" />
                </Button>
                <DropdownMenu slot="list" class="info-menu-add-write">
                    <DropdownItem name="question">
                        <Icon type="ios-help-circle-outline" class="normal"></Icon>
                        <span>提问题</span>
                    </DropdownItem>
                    <DropdownItem name="code">
                        <Icon type="ios-code" class="normal"></Icon>
                        <span>写示例</span>
                    </DropdownItem>
                    <DropdownItem name="issue">
                        <Icon type="ios-information-circle-outline" class="normal"></Icon>
                        <span>提 Issue</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div class="info-menu-more">
            <Button type="text" size="large" @click="handleOpenMore">
                <Icon type="md-more" size="24" />
            </Button>
        </div>

        <Modal title="登录 iView 开发者社区" v-model="visibleSign" width="400" footer-hide>
            <div class="info-menu-sign-in-form">
                <Form ref="formSignin" label-position="top" :model="formSignin" :rules="ruleSignin">
                    <FormItem label="电子邮箱" prop="mail">
                        <Input size="large" prefix="ios-mail-outline" v-model="formSignin.mail" />
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input
                                size="large"
                                v-model="formSignin.password"
                                :type="passwordType"
                                :icon="passwordIcon"
                                prefix="ios-lock-outline"
                                @on-click="handleChangePasswordType"
                                @on-enter="handleSignin" />
                    </FormItem>
                </Form>
                <div id="vaptcha_container">
                    <div class="vaptcha-init-main">
                        <div class="vaptcha-init-loading">
                            <span class="vaptcha-text">人机校验启动中...</span>
                        </div>
                    </div>
                </div>
                <div class="info-menu-sign-in-aside">
                    <Button :loading="isPost" type="success" size="large" long @click="handleSignin">登录</Button>
                    <div class="info-menu-sign-in-aside-tip">
                        <p><a href="https://dev.iviewui.com/recover" target="_blank">忘记密码？</a></p>
                        <p>尚未拥有账户？ <a href="https://dev.iviewui.com/signup" target="_blank">注册</a></p>
                    </div>
                </div>
            </div>
        </Modal>

        <Drawer width="320" v-model="visibleMore">
            <Divider>文档设置</Divider>
            <Row class="info-menu-more-item" type="flex" justify="center" align="middle">
                <i-col span="12">
                    <div class="info-menu-more-item-title normal">文档版本</div>
                </i-col>
                <i-col span="12">
                    <div class="info-menu-more-item-main">
                        <Select size="small" value="3" style="width: 100px" @on-change="handleChangeVersion">
                            <Option value="3">3.x</Option>
                            <Option value="2">2.x</Option>
                            <Option value="1">1.x</Option>
                        </Select>
                    </div>
                </i-col>
            </Row>

            <Row class="info-menu-more-item" type="flex" justify="center" align="middle">
                <i-col span="12">
                    <div class="info-menu-more-item-title normal">文档语言</div>
                </i-col>
                <i-col span="12">
                    <div class="info-menu-more-item-main">
                        <div class="info-menu-more-item-radio-group">
                            <div class="info-menu-more-item-radio" :class="{'on': settings.lang === 'zh-CN'}" @click="handleChangeSettings('lang', 'zh-CN')">
                                <Tooltip content="简体中文" placement="top">
                                    <img src="../images/icon-lang-zh.png">
                                </Tooltip>
                            </div>
                            <div class="info-menu-more-item-radio" :class="{'on': settings.lang === 'en-US'}" @click="handleChangeSettings('lang', 'en-US')">
                                <Tooltip content="English" placement="top">
                                    <img src="../images/icon-lang-en.png">
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>

            <Row class="info-menu-more-item" type="flex" justify="center" align="middle">
                <i-col span="12">
                    <div class="info-menu-more-item-title normal">代码块风格</div>
                </i-col>
                <i-col span="12">
                    <div class="info-menu-more-item-main">
                        <div class="info-menu-more-item-radio-group">
                            <div class="info-menu-more-item-radio" :class="{'on': settings.code === '1'}" @click="handleChangeSettings('code', '1')">
                                <Tooltip content="左边示例，右边代码" placement="top">
                                    <img src="../images/icon-code-1.png">
                                </Tooltip>
                            </div>
                            <div class="info-menu-more-item-radio" :class="{'on': settings.code === '2'}" @click="handleChangeSettings('code', '2')">
                                <Tooltip content="只有示例" placement="top">
                                    <img src="../images/icon-code-2.png">
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>

            <Row class="info-menu-more-item" type="flex" justify="center" align="middle">
                <i-col span="12">
                    <div class="info-menu-more-item-title normal">是否显示赞助商广告</div>
                </i-col>
                <i-col span="12">
                    <div class="info-menu-more-item-main">
                        <div class="info-menu-more-item-radio-group">
                            <div class="info-menu-more-item-radio" :class="{'on': settings.ad === '1'}" @click="handleChangeSettings('ad', '1')">
                                <Tooltip content="显示" placement="top">
                                    <img src="../images/icon-ad-1.png">
                                </Tooltip>
                            </div>
                            <div class="info-menu-more-item-radio" :class="{'on': settings.ad === '2'}" @click="handleChangeSettings('ad', '2')">
                                <Tooltip content="不显示" placement="top">
                                    <img src="../images/icon-ad-2.png">
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </i-col>
                <Alert class="info-menu-more-alert" type="warning" v-if="settings.ad === '2' && (!app.userInfo || app.userInfo.vip_grade === 1)">
                    该设置目前仅对 iView Developer 付费会员有效
                    <a href="javascript:void(0)" @click="handleOpenSignIn" v-if="!app.userInfo">登录后验证会员信息</a>
                    <a href="https://dev.iviewui.com/upgrade" target="_blank" v-else>升级会员</a>
                </Alert>
            </Row>

            <!--<Row class="info-menu-more-item" type="flex" justify="center" align="middle">-->
                <!--<i-col span="12">-->
                    <!--<div class="info-menu-more-item-title normal">色弱模式</div>-->
                <!--</i-col>-->
                <!--<i-col span="12">-->
                    <!--<div class="info-menu-more-item-right-align">-->
                        <!--<Switch v-model="settings.colorWeak" true-value="1" false-value="2" @on-change="handleChangeColorWeak">-->
                            <!--<Icon type="md-checkmark" slot="open"></Icon>-->
                            <!--<Icon type="md-close" slot="close"></Icon>-->
                        <!--</Switch>-->
                    <!--</div>-->
                <!--</i-col>-->
            <!--</Row>-->
            <Divider>社区</Divider>
            <row>
                <i-col span="12">
                    <Tooltip content="关注 GitHub" placement="top">
                        <Button size="large" to="https://github.com/iview/iview" target="_blank" icon="logo-github">
                            <strong>Star {{ app.githubInfo.stargazers_count }}</strong>
                        </Button>
                    </Tooltip>
                </i-col>
                <i-col span="12">
                    <row>
                        <i-col span="8">
                            <Tooltip content="iView 知乎专栏" placement="top">
                                <a href="https://zhuanlan.zhihu.com/feview" target="_blank">
                                    <img src="../images/icon-social-zhihu.svg" class="footer-social-icon">
                                </a>
                            </Tooltip>
                        </i-col>
                        <i-col span="8">
                            <Tooltip content="掘金" placement="top">
                                <a href="https://juejin.im/user/56fe494539b0570054f2e032" target="_blank">
                                    <img src="../images/icon-social-juejin.svg" class="footer-social-icon footer-social-icon-bg">
                                </a>
                            </Tooltip>
                        </i-col>
                        <i-col span="8">
                            <Tooltip content="活动直播间" placement="top">
                                <a href="https://live.bilibili.com/1353202" target="_blank">
                                    <img src="../images/icon-social-bilibili.svg" class="footer-social-icon">
                                </a>
                            </Tooltip>
                        </i-col>
                    </row>
                </i-col>
            </row>
            <div class="info-menu-more-social">
                <img src="../images/icon-qr-qq-wechat.png">
                <row>
                    <i-col span="12" style="margin-left: -7px">
                        QQ 群号：621780943
                    </i-col>
                </row>
            </div>
            <div class="info-menu-more-smile"><strong>: )</strong></div>
        </Drawer>
    </div>
</template>
<script>
    import $ from '../libs/util';
    import bus from './bus';
    import vaptcha from '../mixins/vaptcha';
    import devVipGrade from '../components/vip-grade.vue';

    export default  {
        inject: ['app'],
        mixins: [ vaptcha ],
        components: { devVipGrade },
        props: {
            theme: {
                type: String,
                default: 'dark'
            }
        },
        data () {
            return {
                visibleMore: false,
                visibleSign: false,
                formSignin: {
                    mail: '',
                    password: ''
                },
                ruleSignin: {
                    mail: [
                        {required: true, message: '请填写邮箱', trigger: 'blur'},
                        {type: 'email', message: '请填写正确的邮箱', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请填写密码', trigger: 'blur'}
                    ]
                },
                isPost: false,
                passwordType: 'password',
                settings: {
                    lang: 'zh-CN',
                    code: '1',
                    ad: '1',
                    colorWeak: '2'
                },
                social: '', // qq || wechat
            }
        },
        computed: {
            passwordIcon () {
                return this.passwordType === 'password' ? 'ios-eye' : 'ios-eye-off';
            },
            countUnread () {
                return this.app.countUnread_comment + this.app.countUnread_follow + this.app.countUnread_system;
            }
        },
        methods: {
            handleSelectAdd (name) {
                if (name === 'question') {
                    _hmt.push(['_trackEvent', 'info-menu-ask-question', 'click']);
                    window.open('https://dev.iviewui.com/issues/new');
                }

                if (name === 'code') {
                    _hmt.push(['_trackEvent', 'info-menu-run', 'click']);
                    window.open('https://run.iviewui.com');
                }

                if (name === 'issue') {
                    _hmt.push(['_trackEvent', 'info-menu-ask-issue', 'click']);
                    window.open('https://www.iviewui.com/new-issue');
                }
            },
            handleOpenMore () {
                _hmt.push(['_trackEvent', 'info-menu-more', 'click']);
                this.visibleMore = true;
            },
            handleOpenSignIn () {
                _hmt.push(['_trackEvent', 'info-menu-sign-in', 'click']);
                this.visibleSign = true;
            },
            handleChangePasswordType () {
                if (this.passwordType === 'password') this.passwordType = 'text';
                else this.passwordType = 'password';
            },
            handleSignin () {
                this.$refs.formSignin.validate((valid) => {
                    if (valid) {
                        if (this.vaptchaToken === '' || this.vaptchaChallenge === '') {
                            this.$Message.error({
                                content: '请先进行人机验证',
                                duration: 3
                            });
                            return false;
                        }

                        this.isPost = true;
                        $.ajax({
                            method: 'post',
                            url: '/v1/user/signin',
                            data: {
                                mail: this.formSignin.mail,
                                password: this.formSignin.password,
                                vaptcha_token: this.vaptchaToken,
                                vaptcha_challenge: this.vaptchaChallenge
                            }
                        }).then(res => {
                            this.isPost = false;
                            const data = res.data;

                            if (data.code !== 200) {
                                this.$Message.error(data.msg);
                                this.getVaptcha();
                            } else {
                                $.store.set('token', data.data.token);
                                this.app.getUserInfo();
                                this.app.handleGetNotificationAll();

                                this.visibleSign = false;
                                this.$Message.success('登录成功');
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败');
                    }
                })
            },
            handleClickItem (name) {
                if (name === 'signout') {
                    this.$Modal.confirm({
                        title: '退出登录确认',
                        content: '您确定要退出登录当前的账号吗？',
                        onOk: () => {
                            $.ajax({
                                method: 'post',
                                url: '/v1/user/signout',
                                data: {
                                    token: this.app.token
                                }
                            }).then(res => {
                                const data = res.data;

                                if (data.code !== 200) {
                                    this.$Message.error(data.msg);
                                } else {
                                    $.store.remove('userInfo');
                                    $.store.remove('token');
                                    this.app.getUserInfo();

                                    this.$Message.success('您已退出登录');
                                }
                            })
                        }
                    });
                }
                if (name === 'home' || name === 'me') {
                    window.open('https://dev.iviewui.com/user/' + this.app.userInfo.id);
                }
                if (name === 'notify') {
                    window.open('https://dev.iviewui.com/issues')
                }

                if (name === 'upgrade') {
                    window.open('https://dev.iviewui.com/upgrade');
                }
                if (name === 'checkmail') {
                    window.open('https://dev.iviewui.com/check/mail');
                }
            },
            handleChangeSettings (type, value) {
                this.settings[type] = value;

                if (type === 'lang') {
                    const lang = this.app.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
                    const path = this.$route.path.indexOf('-en') > -1 ? this.$route.path.split('-en')[0] : this.$route.path + '-en';
                    bus.$emit('on-change-lang', lang, path);
                }
                if (type === 'code') {
                    this.app.settingData.code = value;
                    window.localStorage.setItem('settings-code', value);
                }
                if (type === 'ad') {
                    this.app.settingData.ad = value;
                    window.localStorage.setItem('settings-ad', value);
                }
            },
            handleChangeVersion (v) {
                if (v == 1) {
                    window.location.href = 'http://v1.iviewui.com';
                }
                if (v == 2) {
                    window.location.href = 'http://v2.iviewui.com';
                }
            },
            handleUpdateSettings () {
                if (window.localStorage.getItem('settings-code')) {
                    this.settings.code = window.localStorage.getItem('settings-code');
                }

                if (window.localStorage.getItem('settings-ad')) {
                    this.settings.ad = window.localStorage.getItem('settings-ad');
                }

                if (window.localStorage.getItem('settings-color-weak')) {
                    this.settings.colorWeak = window.localStorage.getItem('settings-color-weak');
                }
            },
            handleChangeColorWeak (value) {
                this.app.settingData.colorWeak = value;
                window.localStorage.setItem('settings-color-weak', value);
                this.app.handleChangeBodyColorWeak();
            },
            handleChangeSocial (type) {
                _hmt.push(['_trackEvent', 'info-menu-social' + type, 'click']);
                this.social = type;
            }
        },
        mounted () {
            this.handleUpdateSettings();
        }
    }
</script>
<style lang="less">
    @import "../styles/info-menu.less";
</style>