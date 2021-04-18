function parseHocon(text){function readHocon(a){function b(a,d){var a=a||m,d=d||o,e=a.indexOf(".");if(!g&&e>0){var f=a.substring(0,e);return d[f]=d[f]||{},void b(a.substring(e+1),d[f])}c||"string"!=typeof n||(/^\d+$/.test(n)?n=parseInt(n):/^\d+\.\d+$/.test(n)?n=parseFloat(n):"true"===n?n=!0:"false"===n?n=!1:"null"===n&&(n=null)),g?d.push(n):("object"==typeof d[a]&&"object"==typeof n?extend(d[a],n):d[a]=n,h=!1),i=!1,m="",n=""}for(var c=!1,d="",e=!1,f=!1,g=!1,h=!1,i=!1,j=!1,k=!1,l=!1,m="",n="",o={};index<a.length;){var p=a[index];if(index++,!j||l)if(!e&&'"'===p&&index+1<a.length&&'"'===a[index]&&'"'===a[index+1]){if(l){b(),l=!1,c=!1,h=!1,index+=2;continue}l=!0,c=!0,h=!0,index+=2}else if(e||l||"'"!==p&&'"'!==p)if(l&&function(a){return-1!==['"',"\\"].indexOf(a)}(p))n+=p;else if(c&&"\\"===p)e=!0;else{if(e=!1,!c)switch(p){case" ":if(""!==m&&!h){m+=p;continue}if(""===n)continue;if(g&&h){n+=p;continue}case"\t":case"\r":case"\n":if(g&&h){if(""===n)continue;b();continue}if(!m)continue;if(!h){h=!0;continue}if(h&&n){b();continue}continue;case"{":if(f||g||m){index--,m=m.trim(),n=readHocon(a),b();continue}f=!0;continue;case"}":if(!f)throw"What";if(n)b();else if(m)return m;return o;case":":case"=":if(i)throw"Already met seperator";h=!0,i=!0,m=m.trim();continue;case",":h&&n&&b();continue;case"[":if(f||g||m){index--,n=readHocon(a),b();continue}h=!0,g=!0,o=[];continue;case"]":if(!g)throw"not in an array";return n&&(n=n.trim(),b()),o;case"$":if(!n){n="${"+readHocon(a)+"}",b();continue}break;case"#":j=!0;continue;case"/":if(k){j=!0,k=!1;continue}k=!0;continue}h?n+=p:m+=p}else{if(c&&d===p){h?b():h=!0,c=!1;continue}c=!0,d=p}else"\r"!==p&&"\n"!==p||(j=!1)}if(f)throw"Expected closing curly bracket";if(g)throw"Expected closing square bracket";return h&&b(),o}function handleSubtitutions(mainObj,intermidiateObj,loops){if((loops=loops||0)>8)return null;if(null==(intermidiateObj=void 0===intermidiateObj?mainObj:intermidiateObj))return intermidiateObj;if(Array.isArray(intermidiateObj))intermidiateObj.forEach(function(a,b){intermidiateObj[b]=handleSubtitutions(mainObj,a)});else if("string"==typeof intermidiateObj){var match=/^\$\{(.+?)\}$/.exec(intermidiateObj);if(match&&2==match.length){var val=eval("mainObj."+match[1]);return void 0===val?null:handleSubtitutions(mainObj,val,loops+1)}}else"object"==typeof intermidiateObj&&Object.keys(intermidiateObj).forEach(function(a,b){intermidiateObj[a]=handleSubtitutions(mainObj,intermidiateObj[a])});return intermidiateObj}function extend(){for(var a=1;a<arguments.length;a++)for(var b in arguments[a])arguments[a].hasOwnProperty(b)&&("object"==typeof arguments[0][b]&&"object"==typeof arguments[a][b]?extend(arguments[0][b],arguments[a][b]):arguments[0][b]=arguments[a][b]);return arguments[0]}var index=0,result=readHocon(text);return handleSubtitutions(result)}
//# sourceMappingURL=hocon.min.js.map