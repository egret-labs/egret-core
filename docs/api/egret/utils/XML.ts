/**
*   使用以下代码进行XML到JSON的属性访问
*/
class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var employees: any = '<employees>' +
            '<employee ssn="092">' +
            '<name first="Xin" last="FangKe"/>' +
            '<address>' +
            '<city>BeiJing</city>' +
            '<Level>0</Level>' +
            '</address>' +
            '</employee>' +
            '</employees>';

        var jsonData: any = egret.XML.parse(employees);
        //employees
        console.log(jsonData.name);//employees
        console.log(jsonData.children.length);//1 {employee,employee}
        console.log(jsonData.children[0].name);//employee
        console.log(jsonData.children[0].$ssn);//092
        //employee
        console.log(jsonData.children[0].children.length);//2 {name,address}
        console.log(jsonData.children[0].children[0].name);//name
        console.log(jsonData.children[0].children[0].$first);//Xin
        console.log(jsonData.children[0].children[0].$last);//FangKe
        //address
        console.log(jsonData.children[0].children[1].name);//address
        console.log(jsonData.children[0].children[1].children.length);//2 {city,Level}
        console.log(jsonData.children[0].children[1].children[0].name);//city
        console.log(jsonData.children[0].children[1].children[0].text);//BeiJing
        console.log(jsonData.children[0].children[1].children[1].name);//Level
        console.log(jsonData.children[0].children[1].children[1].text);//0
    }
}