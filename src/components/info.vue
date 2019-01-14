<template>
    <div class="info-menu">
        <div class="info-menu-sign-in">
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

        <Drawer width="320" v-model="visibleMore">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>

            <Divider>文档设置</Divider>
        </Drawer>
    </div>
</template>
<script>
    export default  {
        data () {
            return {
                visibleMore: false
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
            }
        }
    }
</script>
<style lang="less">
    @import "../styles/info-menu.less";
</style>