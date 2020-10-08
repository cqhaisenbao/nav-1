const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
const hasMap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn/'},
    {logo: 'B', url: 'https://www.bilibili.com/'}
]
//封装简化网站名称的函数
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') //删除 /开头的内容
}

const render = () => {
    $siteList.find('li:not(.last)').remove()
    hasMap.forEach((node, index) => {
        const $li = $(`<li>
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                 </div>   
                </div>
              </li>`).insertBefore($lastLi)
        $li.on('click', () => {
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation()  //阻止冒泡
            console.log(index);
            hasMap.splice(index, 1)  //通过下标从哈希表删除当前项
            render()  //删除后重新渲染
        })
    })
}
render()

//添加网站
$('.addButton')
    .on('click', () => {
        let url = window.prompt('请输入你要添加的网址')
        if (url.indexOf('http') !== 0) {
            url = 'https://' + url
        }
        hasMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),
            logoType: 'text',
            url: url
        })
        render()
    })

//用户离开当前页面自动把哈希表保持在本地
window.onbeforeunload = () => {
    const string = JSON.stringify(hasMap)
    localStorage.setItem('x', string)
}

//添加键盘事件，按键=网站logo就直接跳转
$(document).on('keypress', (e) => {
    const key = e.key  //变量名和属性名一样可以简写为const {key}=e
    for (let i = 0; i < hasMap.length; i++) {
        if (hasMap[i].logo.toLowerCase() === key) {
            window.open(hasMap[i].url)
        }
    }
})

