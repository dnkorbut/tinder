(() => {
    // config:
    const likea = true // like all (skip next two if true)
    const tsize = 128 // minimal amount of letters in bio
    const regex = /no fwb/i // dislike if found
    const likes = 1000 // maximal likes per run
    const speed = 15 // timeout to let it be preloaded
    const timeo = 15 // timeout to let bio be loaded
    const msgtm = 200 // timeout on match
    // ^

    let liked = 0
    let noped = 0
    let msged = 0
    let rexno = 0

    let likesleft = likes

    function msg() {
        const xpath = "//button[text()='❤️']"
        const me = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (me) {
            me.click()
            msged++
            console.log("messaged")
        }
    }
    function close() {
        let xpath = "//span[text()='Close']"
        let me = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (me) {
            me.click()
            console.log("closed popup")
        }

        xpath = "//div[text()='No Thanks']"
        me = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (me) {
            me.click()
            console.log("closed 'no thanks'")
        }
    }
    function like(likeme = true) {
        const xpath = likeme ? "//span[text()='Like']" : "//span[text()='Nope']";
        const me = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (me) {
            me.click()
            if (likeme) {
                liked++
            } else {
                noped++
            }
        }
    }
    function gettext() {
        const mains = document.getElementsByTagName('main')
        if (mains.length < 1) { return null }
        const main = mains[0]
        const os = main.getElementsByTagName('*')
        let o = null
        for (let i = 0; i < os.length; i++) {
            if (os[i].tagName == 'HR') {
                for (let j = i + 1; j < os.length; j++) {
                    if (os[j].tagName == 'DIV' && os[j].children.length > 0) {
                        o = os[j].children[0]
                        break
                    }
                }
                break
            }
        }
        if (o) {
            return o.innerText
        }
        return null
    }
    function check() {
        let text = gettext()
        if (text === null) {
            console.log('wait..')
            setTimeout(op, timeo)
            return
        }
        let res = false
        if (text.length > tsize) {
            res = true
        }
        if (res) {
            if (text.match(regex)) {
                res = false
                console.log('%cregexp DISLIKE:', 'color: yellow; background-color: red; padding: 1em; font-size: larger')
                console.log('---\n' + text + '\n---')
                rexno++
            } else {
                console.log('%c❤️ LIKE:', 'color: red; background-color: yellow; padding: 1em; font-size: larger')
                console.log('%c---\n' + text + '\n---', 'color: blue')
            }
        } else {
            console.log('%ctoo short: ' + text, 'color: gray')
        }
        //setTimeout(() => {
        if (likea) {
            like(true)
        } else {
            like(res)
        }
        setTimeout(loop, speed)
        //}, 2500)
    }
    function op() {
        const xpath = "//span[text()='Open Profile']";
        const me = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (me) {
            me.click()
            setTimeout(check, timeo)
        } else {
            console.log('wait...')
            setTimeout(op, timeo)
        }
    }
    function loop() {
        if (likesleft-- > 0) {
            close()
            setTimeout(op, msg() ? msgtm : timeo)
        }
        if ((liked + noped) % 10 == 0) {
            console.log('liked: ' + liked + '\nnoped: ' + noped + '\ntotal: ' + (liked + noped) + '\nmsged: ' + msged + '\nrexno: ' + rexno + '\nlikes: ' + Math.round(liked / (liked + noped) * 100) + '%')
        }
    }
    loop()
})()