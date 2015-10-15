//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015; Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms; with or without
//  modification; are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice; this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice; this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES; INCLUDING; BUT NOT LIMITED TO; THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT; INDIRECT;
//  INCIDENTAL; SPECIAL; EXEMPLARY; OR CONSEQUENTIAL DAMAGES (INCLUDING; BUT NOT
//  LIMITED TO; PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE; DATA;
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY; WHETHER IN CONTRACT; STRICT LIABILITY; OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE;
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module eui {

    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["en_US"] = egret.$locale_strings["en_US"] || {};
    var locale_strings = egret.$locale_strings["en_US"];

    //2000-2999
    locale_strings[2001] = "EXML parsing error {0}: EXML file can't be found ";
    locale_strings[2002] = "EXML parsing error : invalid XML file:\n{0}";
    locale_strings[2003] = "EXML parsing error {0}: the class definitions corresponding to nodes can't be found  \n {1}";
    locale_strings[2004] = "EXML parsing error {0}: nodes cannot contain id property with the same name \n {1}";
    locale_strings[2005] = "EXML parsing error {0}: property with the name of '{1}' does not exist on the node: \n {2}";
    locale_strings[2006] = "EXML parsing error {0}: undefined view state name: '{1}' \n {2}";
    locale_strings[2007] = "EXML parsing error {0}: only UIComponent objects within the container can use the includeIn and excludeFrom properties\n {1}";
    locale_strings[2008] = "EXML parsing error {0}: fail to assign values of '{1}' class to property: '{2}' \n {3}";
    locale_strings[2009] = "EXML parsing error {0}: only one ID can be referenced in the node property value '{}' label; and complex expression is not allowed to use \n {1}";
    locale_strings[2010] = "EXML parsing error {0}: ID referenced by property: '{1}':  '{2}' does not exist \n {3}";
    locale_strings[2011] = "EXML parsing error {0}: fail to assign more than one child nodes to the same property: '{1}' \n {2}";
    locale_strings[2012] = "EXML parsing error {0}: no default property exists on the node; and you must explicitly declare the property name that the child node  is assigned to \n {1}";
    locale_strings[2013] = "EXML parsing error {0}: view state grammar is not allowed to use on property nodes of Array class \n {1} ";
    locale_strings[2014] = "EXML parsing error {0}: assigning the skin class itself to the node property is not allowed \n {1}";
    locale_strings[2015] = "EXML parsing error {0}: class definition referenced by node: {1} does not exist \n {2}";
    locale_strings[2016] = "EXML parsing error {0}: format error of 'scale9Grid' property value on the node: {1}";
    locale_strings[2017] = "EXML parsing error {0}: namespace prefix missing on the node: {1}";
    locale_strings[2018] = "EXML parsing error {0}: format error of 'skinName' property value on the node: {1}";
    locale_strings[2019] = "EXML parsing error {0}: the container’s child item must be visible nodes: {1}";
    locale_strings[2020] = "EXML parsing error {0}: for child nodes in w: Declarations, the includeIn and excludeFrom properties are not allowed to use \n {1}";

    locale_strings[2101] = "EXML parsing warnning : fail to register the class property : {0},there is already a class with the same name in the global,please try to rename the class name for the exml. \n {1}";
    locale_strings[2102] = "EXML parsing warnning {0}: no child node can be found on the property code \n {1}";
    locale_strings[2103] = "EXML parsing warnning {0}: the same property '{1}' on the node is assigned multiple times \n {2}";
    locale_strings[2104] = "Instantiate class {0} error，the parameters of its constructor method must be empty.";

    locale_strings[2201] = "BasicLayout doesn't support virtualization.";
    locale_strings[2202] = "parse skinName error，the parsing result of skinName must be a instance of eui.Skin.";
    locale_strings[2203] = "Could not find the skin class '{0}'。";

    locale_strings[2301] = "parse source failed，could not find asset from URL：{0} .";

}
