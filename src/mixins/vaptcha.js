import $ from '../libs/util';
import config from '../config/config';

export default {
    data () {
        return {
            vaptchaVid: '',
            vaptchaToken: '',
            vaptchaChallenge: ''
        }
    },
    methods: {
        getVaptcha () {
            this.vaptchaVid = '';
            this.vaptchaToken = '';
            this.vaptchaChallenge = '';

            $.ajax({
                method: 'post',
                url: '/v1/user/getVaptcha',
                data: {

                }
            }).then(res => {
                const data = res.data;

                if (data.code !== 200) {
                    this.$Message.error(data.msg);
                } else {
                    const response = JSON.parse(data.data);
                    this.vaptchaVid = response.vid;
                    this.vaptchaChallenge = response.challenge;

                    this.initVaptcha();
                }
            })
        },
        initVaptcha () {
            const https = config.env !== 'development';

            const options = {
                vid: this.vaptchaVid,//站点id ,string,必选,
                challenge: this.vaptchaChallenge,//验证流水号 ,string,必选,
                container: document.getElementById('vaptcha_container'),//验证码容器,element,必选,
                type: 'float',//验证码类型,string,默认 float,可选择float,popup,embed,
                https: https,//是否是https , boolean,默认true,(false:http),
                color: '#2d8cf0',//点击式按钮的背景颜色,string
                jsonp: false, //宕机模式使用jsonp请求，boolean 默认为false
                outage: '/getDownTimeJsonp',
                success: (token, challenge) => {//当验证成功时执行回调,function,参数token为string,必选,
                    //提交表单时将token，challenge一并提交，作为验证通过的凭证，服务端进行二次验证  宕机模式无challenge
                    this.vaptchaToken = token;
                    this.vaptchaChallenge = challenge;
                },
                fail: () => {//验证失败时执行回调
                    //todo:执行人机验证失败后的事情
                }
            };
            //vaptcha对象
            let vaptcha_obj;
            window.vaptcha(options, function (obj) {
                vaptcha_obj = obj;
                //执行初始化
                vaptcha_obj.init();
            });
        }
    },
    mounted () {
        this.getVaptcha();
    }
}