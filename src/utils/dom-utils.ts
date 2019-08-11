export class DomUtils {

    public static removeAllFocus() {
        let listInputs = <HTMLCollectionOf<HTMLInputElement>> document.getElementsByTagName('input');
        for(let i = 0; i< listInputs.length; i++) {
            listInputs[i].blur()
        }
    }
}