/**
 * Created by egret on 2014/12/10.
 */

var locale = require( "../locale/zh-CN.js" );

/// 参数说明中的文字说明与关键字之间的最小间隔
var GAP_WORD_AND_ITS_DESC = 3;

//console.log( "ah ah ah .... egret help info defination parser start work!" );

var space = ' ';
var newLine = '\n';
var indent = '    ';

/// 常量集合类 分析器 键集类
var HelpDefParserKey = function () {
}
HelpDefParserKey.COMMAND = "command";
HelpDefParserKey.DESC = "desc";
HelpDefParserKey.PARAMETERS = "parameters";

HelpDefParserKey.PLACEHOLDER = "placeholder";
HelpDefParserKey.OPTIONAL = "optional";

HelpDefParserKey.CONFIGS = "configs";

HelpDefParserKey.NAME = "name";
HelpDefParserKey.PREFIX = "prefix";

HelpDefParserKey.CONFIG_PARAS = "config-paras";

HelpDefParserKey.TYPE = "type";

HelpDefParserKey.ENUM_LIST = "enum-list";

var CfgParaType = function () {
}
CfgParaType.STRING = "string";
CfgParaType.ENUM = "enum";

/// 结构体类 参数/配置说明单位，需要填充完毕后进行对齐
var DetailBody = function (word, desc) {
   this.word = word;
   this.desc = desc;
}

DetailBody.prototype.joinWithSpaceAlign = function (iGapSpace) {
   //console.log( "空格数:", iGapSpace, "<", getRepeatString( space, iGapSpace - this.word.length ), ">" );
   return this.word + getRepeatString(space, iGapSpace - this.word.length) + this.desc;
}

function logHelpDef( command ) {

   //console.log( "logHelpDef head:" );
    var help_def_set = require("./set.js");
   //console.log( "logHelpDef logHelpDef:", help_def_set );
   //console.log( "logHelpDef required set:", help_def_set["help_def"], "\n:", help_def_set["help_def"][ command ] );
    var json = help_def_set["help_def"][ command ];
    if (!json){
        return false;
    }

   /// 帮助信息分为三部分 用法 描述 和参数说明。先放在三个字符串元素中，最后再组合。
   var sDesc;
   var sPrefix;
   var sPrefixCfgPara;
   var sName;
   var sPlaceHolder;
   var bOptional;

   var sFormBuffer = locale.help_dict.form + ":";
   var sDescBuffer = locale.help_dict.desc +":";
   var sDetailBuffer = locale.help_dict.detail +":";

   /// 命令总体描述 最简单，先取出值。 之后专心分析 用法 和 参数说明
   sDescBuffer += newLine + indent + json[HelpDefParserKey.DESC];

   /// 命令范式元素暂存数组
   var aFormCollection = ["egret"];
   aFormCollection.push(json[HelpDefParserKey.COMMAND]);

   /// 配置说明半成品元素暂存数组
   var aDetailBody = [];

   /// 参数的占位符 或 配置的关键字 最大长度线。
   var iWordLenMax = 0;

   /// 对参数的逐一分析，分别 添加到 用法 和 参数说明部分
   var aParameter = json[HelpDefParserKey.PARAMETERS];
   for (var i = 0; i < aParameter.length; ++i) {
      var oParameter = aParameter[i];
      sPlaceHolder = oParameter[HelpDefParserKey.PLACEHOLDER];
      sDesc = oParameter[HelpDefParserKey.DESC];
      bOptional = oParameter[HelpDefParserKey.OPTIONAL] == "true";

      /// 命令范式拼接
      aFormCollection.push(getFwco(sPlaceHolder, bOptional));

      /// 参数说明拼接 并最高长度记录
      iWordLenMax = Math.max(iWordLenMax, sPlaceHolder.length);
      aDetailBody.push(new DetailBody(sPlaceHolder, sDesc));
   }

   /// 对配置的逐一分析，分别添加到 用法 和 参数说明部分
   var aConfig = json[HelpDefParserKey.CONFIGS];
   for (var i = 0; i < aConfig.length; ++i) {
      var oConfig = aConfig[i];

      sName = oConfig[HelpDefParserKey.NAME];
      sPrefix = oConfig[HelpDefParserKey.PREFIX];
      sDesc = oConfig[HelpDefParserKey.DESC];
      bOptional = oConfig[HelpDefParserKey.OPTIONAL] == "true";

      /// 配置说明拼接 并最高长度记录
      iWordLenMax = Math.max(iWordLenMax, (sPrefix + sName).length);
      aDetailBody.push(new DetailBody(sPrefix + sName, sDesc));

      /// 配置参数的范式显示根据类型不一样，因此首先得到 未考虑可选项的范式单词
      var fwcoSubLv1 = "";
      var bOptSubLv1;

      var aCfgParas = oConfig[HelpDefParserKey.CONFIG_PARAS];
      for (var j = 0; j < aCfgParas.length; ++j) {
         var oCfgPara = aCfgParas[j];
         var sType = oCfgPara[HelpDefParserKey.TYPE];
         bOptSubLv1 = oCfgPara[HelpDefParserKey.OPTIONAL] == "true";

         switch (sType) {
            case  CfgParaType.STRING:
               sPlaceHolder = oCfgPara[HelpDefParserKey.PLACEHOLDER];

               /// 配置参数不一定需要描述，需要判断描述是否为空来进行处理
               sDesc = oCfgPara[HelpDefParserKey.DESC];
               /// 前缀是否存在往往与描述是否存在一致，即要么都没，要么都有
               sPrefixCfgPara = oCfgPara[HelpDefParserKey.PREFIX];
                //console.log( "sPrefix:", sPrefix );

               if( sDesc ){
                  /// 配置说明拼接 并最高长度记录
                  iWordLenMax = Math.max(iWordLenMax, (sPrefixCfgPara + sPlaceHolder).length);
                  aDetailBody.push(new DetailBody(sPrefixCfgPara + sPlaceHolder, sDesc));
               }

               fwcoSubLv1 = getFwco( sPrefixCfgPara ? sPrefixCfgPara + sPlaceHolder : sPlaceHolder, bOptSubLv1 );
               break;
            case  CfgParaType.ENUM:
               var aEnumList = oCfgPara[HelpDefParserKey.ENUM_LIST];
               fwcoSubLv1 = getFwco( aEnumList.join("|"), bOptSubLv1 );
               break;
         }
      }

      aFormCollection.push( getFwco(
         sPrefix + sName + ( fwcoSubLv1.length ? space + fwcoSubLv1 : ''), bOptional )
      );

   }

   /// 配置说明元素暂存数组
   var aDetailCollection = [];

   /// 对参数及配置的说明 进行word部分的最长对齐！
   for (var i = 0; i < aDetailBody.length; ++i) {
      var detailBody = aDetailBody[i];
      aDetailCollection.push(
         detailBody.joinWithSpaceAlign(iWordLenMax + GAP_WORD_AND_ITS_DESC)
      );
   }


   //// 用法 缓冲集合
   sFormBuffer += newLine + indent + aFormCollection.join(space);

   //// 参数/配置说明 缓冲集合
   if( aDetailCollection.length ){
      sDetailBuffer += newLine + indent + aDetailCollection.join(newLine + indent);
   }else{
      sDetailBuffer = "";
   }

   var aConsoleOut;

   if( sDetailBuffer.length ){
      aConsoleOut = [sFormBuffer, sDescBuffer, sDetailBuffer];
   }else{
      aConsoleOut = [sFormBuffer, sDescBuffer];
   }

   console.log( aConsoleOut.join(newLine) );
   console.log( "(output from help def configuration!)" );

    return true;

}

/// 获得 已考虑可选项标记的范式单词   Form Word Consider Optional
function getFwco(sWord, bOptional) {
   return bOptional ? "[" + sWord + "]" : sWord;
}


function getRepeatString(sBase, nRepeat) {
   if (nRepeat <= 0) {
      throw new Error("play with me ?!");
   } else {
      var sProd = sBase;
      for (var i = nRepeat; i > 1; --i) sProd = sBase + sProd;
      return sProd;
   }
}

exports.logHelpDef = logHelpDef;