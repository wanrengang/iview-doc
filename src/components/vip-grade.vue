<template>
    <div :class="className">
        <slot></slot>
        <template v-if="grade === 1 && !hideNormal">
            <img src="../images/vip_free.png" v-if="!hideIcon">
            <span v-if="!hideName">普通会员</span>
        </template>
        <template v-if="grade === 2">
            <img src="../images/vip_gold.png" v-if="!hideIcon">
            <span v-if="!hideName">黄金会员</span>
        </template>
        <template v-if="grade === 3">
            <img src="../images/vip_diamond.png" v-if="!hideIcon">
            <span v-if="!hideName">钻石会员</span>
        </template>
        <template v-if="grade === 4">
            <img src="../images/vip_supremacy.png" v-if="!hideIcon">
            <span v-if="!hideName">至尊会员</span>
        </template>
    </div>
</template>
<script>
    export default {
        props: {
            grade: {
                type: Number,
                default: 1
            },
            className: {
                type: String,
                default: 'dev-user-pop-user-info-desc-vip'
            },
            hideNormal: {
                type: Boolean,
                default: false
            },
            hideName: {
                type: Boolean,
                default: false
            },
            hideIcon: {
                type: Boolean,
                default: false
            }
        }
    };
</script>