
toast.addEventListener('click', ()=> {toast.setAttribute('active', 'false'); clearTimeout(Toast.timeout); Toast.timeout = null})

export default class Toast {

    static timeout = null

    static open(message, severity, ms = 4000){
        if(Toast.timeout != null){
            clearTimeout(Toast.timeout)
        }
        toast.setAttribute('severity', severity)
        toast.setAttribute('active', true)
        toast.children[0].innerHTML = message;

        Toast.timeout = setTimeout(()=> {toast.setAttribute('active', 'false'); Toast.timeout = null }, ms)

    }
}