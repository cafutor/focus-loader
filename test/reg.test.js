const importSyntaxReg=new RegExp(/import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s.]*(([@\w/_-]+(.[a-zA-Z0-9]*))|(((.){1}.?\/)([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+(.[a-zA-Z0-9]*)))["'(\s)*(\;)?\s]*/g);


describe('test import syntax reg ',()=>{
    test('import "index.scss"',()=>{
        const importStr=`
        import "index.scss";
        import 'index.scss'
        import "../index.scss";
        import "./index.scss";
        `;
        expect(importStr.replace(importSyntaxReg,'').trim()==='').toBe(true);
    });
    test('import "@focus/center"',()=>{
        const importStr=`
        import "@focus/center"
        import "@focus"
        import "@focus/"
        `;
        console.log(importStr.replace(importSyntaxReg,''));
        expect(importStr.replace(importSyntaxReg,'').trim()==='').toBe(true);
    });
    test('import "@focus/center-ht"',()=>{
        const importStr=`
        import "@focus/center-ht"
        import "@focus/center-ht-name"
        import "@focus/center-ht-name/lib"
        import "@focus/center-ht-name"
        `;
        expect(importStr.replace(importSyntaxReg,'').trim()==='').toBe(true);
    });
    test('import a as b "@focus/center-ht"',()=>{
        const importStr=`
        import "@focus/center-ht"
        import a as b from "@focus/center-ht"
        import "@focus/center-ht-name/lib"
        import "../@focus/center-ht-name"
        `;
        expect(importStr.replace(importSyntaxReg,'').trim()==='').toBe(true);
    });
});