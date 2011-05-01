/*
 *  /MathJax/jax/input/TeX/jax.js
 *  
 *  Copyright (c) 2010 Design Science, Inc.
 *
 *  Part of the MathJax library.
 *  See http://www.mathjax.org for details.
 * 
 *  Licensed under the Apache License, Version 2.0;
 *  you may not use this file except in compliance with the License.
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */

(function(d){var c=true,f=false,i,h=String.fromCharCode(160);var e=MathJax.Object.Subclass({Init:function(l,k){this.global={isInner:k};this.data=[b.start(this.global)];if(l){this.data[0].env=l}this.env=this.data[0].env},Push:function(){var l,k,n,o;for(l=0,k=arguments.length;l<k;l++){n=arguments[l];if(n instanceof i.mbase){n=b.mml(n)}n.global=this.global;o=(this.data.length?this.Top().checkItem(n):c);if(o instanceof Array){this.Pop();this.Push.apply(this,o)}else{if(o instanceof b){this.Pop();this.Push(o)}else{if(o){this.data.push(n);if(n.env){for(var p in this.env){if(this.env.hasOwnProperty(p)){n.env[p]=this.env[p]}}this.env=n.env}else{n.env=this.env}}}}}},Pop:function(){var k=this.data.pop();if(!k.isOpen){delete k.env}this.env=(this.data.length?this.Top().env:{});return k},Top:function(k){if(k==null){k=1}if(this.data.length<k){return null}return this.data[this.data.length-k]},Prev:function(k){var l=this.Top();if(k){return l.data[l.data.length-1]}else{return l.Pop()}},toString:function(){return"stack[\n  "+this.data.join("\n  ")+"\n]"}});var b=e.Item=MathJax.Object.Subclass({type:"base",closeError:"Extra close brace or missing open brace",rightError:"Missing \\left or extra \\right",Init:function(){if(this.isOpen){this.env={}}this.data=[];this.Push.apply(this,arguments)},Push:function(){this.data.push.apply(this.data,arguments)},Pop:function(){return this.data.pop()},mmlData:function(k,l){if(k==null){k=c}if(this.data.length===1&&!l){return this.data[0]}return i.mrow.apply(i,this.data).With((k?{inferred:c}:{}))},checkItem:function(k){if(k.type==="over"&&this.isOpen){k.num=this.mmlData(f);this.data=[]}if(k.type==="cell"&&this.isOpen){d.Error("Misplaced "+k.name)}if(k.isClose&&this[k.type+"Error"]){d.Error(this[k.type+"Error"])}if(!k.isNotStack){return c}this.Push(k.data[0]);return f},With:function(k){for(var l in k){if(k.hasOwnProperty(l)){this[l]=k[l]}}return this},toString:function(){return this.type+"["+this.data.join("; ")+"]"}});b.start=b.Subclass({type:"start",isOpen:c,Init:function(k){this.SUPER(arguments).Init.call(this);this.global=k},checkItem:function(k){if(k.type==="stop"){return b.mml(this.mmlData())}return this.SUPER(arguments).checkItem.call(this,k)}});b.stop=b.Subclass({type:"stop",isClose:c});b.open=b.Subclass({type:"open",isOpen:c,stopError:"Extra open brace or missing close brace",checkItem:function(l){if(l.type==="close"){var k=this.mmlData();return b.mml(i.TeXAtom(k))}return this.SUPER(arguments).checkItem.call(this,l)}});b.close=b.Subclass({type:"close",isClose:c});b.subsup=b.Subclass({type:"subsup",stopError:"Missing superscript or subscript argument",checkItem:function(l){var k=["","subscript","superscript"][this.position];if(l.type==="open"||l.type==="left"){return c}if(l.type==="mml"){this.data[0].SetData(this.position,l.data[0]);return b.mml(this.data[0])}if(this.SUPER(arguments).checkItem.call(this,l)){d.Error("Missing open brace for "+k)}},Pop:function(){}});b.over=b.Subclass({type:"over",isClose:c,name:"\\over",checkItem:function(m,k){if(m.type==="over"){d.Error("Ambiguous use of "+m.name)}if(m.isClose){var l=i.mfrac(this.num,this.mmlData(f));if(this.thickness!=null){l.linethickness=this.thickness}if(this.open||this.close){l.texClass=i.TEXCLASS.INNER;l.texWithDelims=c;l=i.mfenced(l).With({open:this.open,close:this.close})}return[b.mml(l),m]}return this.SUPER(arguments).checkItem.call(this,m)},toString:function(){return"over["+this.num+" / "+this.data.join("; ")+"]"}});b.left=b.Subclass({type:"left",isOpen:c,delim:"(",stopError:"Extra \\left or missing \\right",checkItem:function(l){if(l.type==="right"){var k=i.mfenced(this.data.length===1?this.data[0]:i.mrow.apply(i,this.data));return b.mml(k.With({open:this.delim,close:l.delim}))}return this.SUPER(arguments).checkItem.call(this,l)}});b.right=b.Subclass({type:"right",isClose:c,delim:")"});b.begin=b.Subclass({type:"begin",isOpen:c,checkItem:function(k){if(k.type==="end"){if(k.name!==this.name){d.Error("\\begin{"+this.name+"} ended with \\end{"+k.name+"}")}if(!this.end){return b.mml(this.mmlData())}return this.parse[this.end].call(this.parse,this,this.data)}if(k.type==="stop"){d.Error("Missing \\end{"+this.name+"}")}return this.SUPER(arguments).checkItem.call(this,k)}});b.end=b.Subclass({type:"end",isClose:c});b.style=b.Subclass({type:"style",checkItem:function(l){if(!l.isClose){return this.SUPER(arguments).checkItem.call(this,l)}var k=i.mstyle.apply(i,this.data).With(this.styles);return[b.mml(k),l]}});b.position=b.Subclass({type:"position",checkItem:function(l){if(l.isClose){d.Error("Missing box for "+this.name)}if(l.isNotStack){var k=l.mmlData();switch(this.move){case"vertical":k=i.mpadded(k).With({height:this.dh,depth:this.dd,voffset:this.dh});return[b.mml(k)];case"horizontal":return[b.mml(this.left),l,b.mml(this.right)]}}return this.SUPER(arguments).checkItem.call(this,l)}});b.array=b.Subclass({type:"array",isOpen:c,arraydef:{},Init:function(){this.table=[];this.row=[];this.env={};this.SUPER(arguments).Init.apply(this,arguments)},checkItem:function(l){if(l.isClose&&l.type!=="over"){if(l.isEntry){this.EndEntry();this.clearEnv();return f}if(l.isCR){this.EndEntry();this.EndRow();this.clearEnv();return f}this.EndTable();this.clearEnv();var k=i.mtable.apply(i,this.table).With(this.arraydef);if(this.open||this.close){k=i.mfenced(k).With({open:this.open,close:this.close})}k=b.mml(k);if(this.requireClose){if(l.type==="close"){return k}d.Error("Missing close brace")}return[k,l]}return this.SUPER(arguments).checkItem.call(this,l)},EndEntry:function(){this.row.push(i.mtd.apply(i,this.data));this.data=[]},EndRow:function(){this.table.push(i.mtr.apply(i,this.row));this.row=[]},EndTable:function(){if(this.data.length||this.row.length){this.EndEntry();this.EndRow()}this.checkLines()},checkLines:function(){if(this.arraydef.rowlines){var k=this.arraydef.rowlines.split(/ /);if(k.length===this.table.length){this.arraydef.frame=k.pop();this.arraydef.rowlines=k.join(" ")}else{if(k.length<this.table.length-1){this.arraydef.rowlines+=" none"}}}},clearEnv:function(){for(var k in this.env){if(this.env.hasOwnProperty(k)){delete this.env[k]}}}});b.cell=b.Subclass({type:"cell",isClose:c});b.mml=b.Subclass({type:"mml",isNotStack:c,Push:function(){for(var l=0,k=arguments.length;l<k;l++){if(arguments[l].type!=="mo"&&arguments[l].isEmbellished()){arguments[l]=i.TeXAtom(arguments[l]).With({isEmbellishedWrapper:c})}}this.data.push.apply(this.data,arguments)},Add:function(){this.data.push.apply(this.data,arguments);return this}});var g={};var j=function(){i=MathJax.ElementJax.mml;MathJax.Hub.Insert(g,{letter:/[a-z]/i,digit:/[0-9.]/,number:/^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,special:{"\\":"ControlSequence","{":"Open","}":"Close","~":"Tilde","^":"Superscript",_:"Subscript"," ":"Space","\t":"Space","\r":"Space","\n":"Space","'":"Prime","%":"Comment","&":"Entry","#":"Hash","\u2019":"Prime"},remap:{"-":"2212","*":"2217"},mathchar0mi:{alpha:"03B1",beta:"03B2",gamma:"03B3",delta:"03B4",epsilon:"03F5",zeta:"03B6",eta:"03B7",theta:"03B8",iota:"03B9",kappa:"03BA",lambda:"03BB",mu:"03BC",nu:"03BD",xi:"03BE",omicron:"03BF",pi:"03C0",rho:"03C1",sigma:"03C3",tau:"03C4",upsilon:"03C5",phi:"03D5",chi:"03C7",psi:"03C8",omega:"03C9",varepsilon:"03B5",vartheta:"03D1",varpi:"03D6",varrho:"03F1",varsigma:"03C2",varphi:"03C6",S:"00A7",aleph:["2135",{mathvariant:i.VARIANT.NORMAL}],hbar:"210F",imath:"0131",jmath:"0237",ell:"2113",wp:["2118",{mathvariant:i.VARIANT.NORMAL}],Re:["211C",{mathvariant:i.VARIANT.NORMAL}],Im:["2111",{mathvariant:i.VARIANT.NORMAL}],partial:["2202",{mathvariant:i.VARIANT.NORMAL}],infty:["221E",{mathvariant:i.VARIANT.NORMAL}],prime:["2032",{mathvariant:i.VARIANT.NORMAL}],emptyset:["2205",{mathvariant:i.VARIANT.NORMAL}],nabla:["2207",{mathvariant:i.VARIANT.NORMAL}],top:["22A4",{mathvariant:i.VARIANT.NORMAL}],bot:["22A5",{mathvariant:i.VARIANT.NORMAL}],angle:["2220",{mathvariant:i.VARIANT.NORMAL}],triangle:["25B3",{mathvariant:i.VARIANT.NORMAL}],backslash:["2216",{mathvariant:i.VARIANT.NORMAL}],forall:["2200",{mathvariant:i.VARIANT.NORMAL}],exists:["2203",{mathvariant:i.VARIANT.NORMAL}],neg:["00AC",{mathvariant:i.VARIANT.NORMAL}],lnot:["00AC",{mathvariant:i.VARIANT.NORMAL}],flat:["266D",{mathvariant:i.VARIANT.NORMAL}],natural:["266E",{mathvariant:i.VARIANT.NORMAL}],sharp:["266F",{mathvariant:i.VARIANT.NORMAL}],clubsuit:["2663",{mathvariant:i.VARIANT.NORMAL}],diamondsuit:["2662",{mathvariant:i.VARIANT.NORMAL}],heartsuit:["2661",{mathvariant:i.VARIANT.NORMAL}],spadesuit:["2660",{mathvariant:i.VARIANT.NORMAL}]},mathchar0mo:{surd:"221A",coprod:["2210",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigvee:["22C1",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigwedge:["22C0",{texClass:i.TEXCLASS.OP,movesupsub:c}],biguplus:["2A04",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigcap:["22C2",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigcup:["22C3",{texClass:i.TEXCLASS.OP,movesupsub:c}],"int":["222B",{texClass:i.TEXCLASS.OP}],intop:["222B",{texClass:i.TEXCLASS.OP,movesupsub:c,movablelimits:c}],iint:["222C",{texClass:i.TEXCLASS.OP}],iiint:["222D",{texClass:i.TEXCLASS.OP}],prod:["220F",{texClass:i.TEXCLASS.OP,movesupsub:c}],sum:["2211",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigotimes:["2A02",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigoplus:["2A01",{texClass:i.TEXCLASS.OP,movesupsub:c}],bigodot:["2A00",{texClass:i.TEXCLASS.OP,movesupsub:c}],oint:["222E",{texClass:i.TEXCLASS.OP}],bigsqcup:["2A06",{texClass:i.TEXCLASS.OP,movesupsub:c}],smallint:["222B",{largeop:f}],triangleleft:"25C3",triangleright:"25B9",bigtriangleup:"25B3",bigtriangledown:"25BD",wedge:"2227",land:"2227",vee:"2228",lor:"2228",cap:"2229",cup:"222A",ddagger:"2021",dagger:"2020",sqcap:"2293",sqcup:"2294",uplus:"228E",amalg:"2A3F",diamond:"22C4",bullet:"2219",wr:"2240",div:"00F7",odot:["2299",{largeop:f}],oslash:["2298",{largeop:f}],otimes:["2297",{largeop:f}],ominus:["2296",{largeop:f}],oplus:["2295",{largeop:f}],mp:"2213",pm:"00B1",circ:"2218",bigcirc:"25EF",setminus:"2216",cdot:"22C5",ast:"2217",times:"00D7",star:"22C6",propto:"221D",sqsubseteq:"2291",sqsupseteq:"2292",parallel:"2225",mid:"2223",dashv:"22A3",vdash:"22A2",leq:"2264",le:"2264",geq:"2265",ge:"2265",lt:"003C",gt:"003E",succ:"227B",prec:"227A",approx:"2248",succeq:"2AB0",preceq:"2AAF",supset:"2283",subset:"2282",supseteq:"2287",subseteq:"2286","in":"2208",ni:"220B",notin:"2209",owns:"220B",gg:"226B",ll:"226A",sim:"223C",simeq:"2243",perp:"22A5",equiv:"2261",asymp:"224D",smile:"2323",frown:"2322",ne:"2260",neq:"2260",cong:"2245",doteq:"2250",bowtie:"22C8",models:"22A8",notChar:"0338",Leftrightarrow:"21D4",Leftarrow:"21D0",Rightarrow:"21D2",leftrightarrow:"2194",leftarrow:"2190",gets:"2190",rightarrow:"2192",to:"2192",mapsto:"21A6",leftharpoonup:"21BC",leftharpoondown:"21BD",rightharpoonup:"21C0",rightharpoondown:"21C1",nearrow:"2197",searrow:"2198",nwarrow:"2196",swarrow:"2199",rightleftharpoons:"21CC",hookrightarrow:"21AA",hookleftarrow:"21A9",longleftarrow:"27F5",Longleftarrow:"27F8",longrightarrow:"27F6",Longrightarrow:"27F9",Longleftrightarrow:"27FA",longleftrightarrow:"27F7",longmapsto:"27FC",ldots:"2026",cdots:"22EF",vdots:"22EE",ddots:"22F1",dots:"2026",dotsc:"2026",dotsb:"22EF",dotsm:"22EF",dotsi:"22EF",dotso:"2026",ldotp:["002E",{texClass:i.TEXCLASS.PUNCT}],cdotp:["22C5",{texClass:i.TEXCLASS.PUNCT}],colon:["003A",{texClass:i.TEXCLASS.PUNCT}]},mathchar7:{Gamma:"0393",Delta:"0394",Theta:"0398",Lambda:"039B",Xi:"039E",Pi:"03A0",Sigma:"03A3",Upsilon:"03A5",Phi:"03A6",Psi:"03A8",Omega:"03A9",_:"005F","#":"0023","$":"0024","%":"0025","&":"0026",And:"0026"},delimiter:{"(":"(",")":")","[":"[","]":"]","<":"27E8",">":"27E9","\\lt":"27E8","\\gt":"27E9","/":"/","|":["|",{texClass:i.TEXCLASS.ORD}],".":"","\\\\":"\\","\\lmoustache":"23B0","\\rmoustache":"23B1","\\lgroup":"27EE","\\rgroup":"27EF","\\arrowvert":"23D0","\\Arrowvert":"2016","\\bracevert":"23AA","\\Vert":["2225",{texClass:i.TEXCLASS.ORD}],"\\|":["2225",{texClass:i.TEXCLASS.ORD}],"\\vert":["|",{texClass:i.TEXCLASS.ORD}],"\\uparrow":"2191","\\downarrow":"2193","\\updownarrow":"2195","\\Uparrow":"21D1","\\Downarrow":"21D3","\\Updownarrow":"21D5","\\backslash":"\\","\\rangle":"27E9","\\langle":"27E8","\\rbrace":"}","\\lbrace":"{","\\}":"}","\\{":"{","\\rceil":"2309","\\lceil":"2308","\\rfloor":"230B","\\lfloor":"230A","\\lbrack":"[","\\rbrack":"]"},macros:{displaystyle:["SetStyle","D",c,0],textstyle:["SetStyle","T",f,0],scriptstyle:["SetStyle","S",f,1],scriptscriptstyle:["SetStyle","SS",f,2],rm:["SetFont",i.VARIANT.NORMAL],mit:["SetFont",i.VARIANT.ITALIC],oldstyle:["SetFont",i.VARIANT.OLDSTYLE],cal:["SetFont",i.VARIANT.CALIGRAPHIC],it:["SetFont",i.VARIANT.ITALIC],bf:["SetFont",i.VARIANT.BOLD],bbFont:["SetFont",i.VARIANT.DOUBLESTRUCK],scr:["SetFont",i.VARIANT.SCRIPT],frak:["SetFont",i.VARIANT.FRAKTUR],sf:["SetFont",i.VARIANT.SANSSERIF],tt:["SetFont",i.VARIANT.MONOSPACE],tiny:["SetSize",0.5],Tiny:["SetSize",0.6],scriptsize:["SetSize",0.7],small:["SetSize",0.85],normalsize:["SetSize",1],large:["SetSize",1.2],Large:["SetSize",1.44],LARGE:["SetSize",1.73],huge:["SetSize",2.07],Huge:["SetSize",2.49],arcsin:["NamedOp",0],arccos:["NamedOp",0],arctan:["NamedOp",0],arg:["NamedOp",0],cos:["NamedOp",0],cosh:["NamedOp",0],cot:["NamedOp",0],coth:["NamedOp",0],csc:["NamedOp",0],deg:["NamedOp",0],det:"NamedOp",dim:["NamedOp",0],exp:["NamedOp",0],gcd:"NamedOp",hom:["NamedOp",0],inf:"NamedOp",ker:["NamedOp",0],lg:["NamedOp",0],lim:"NamedOp",liminf:["NamedOp",null,"lim&thinsp;inf"],limsup:["NamedOp",null,"lim&thinsp;sup"],ln:["NamedOp",0],log:["NamedOp",0],max:"NamedOp",min:"NamedOp",Pr:"NamedOp",sec:["NamedOp",0],sin:["NamedOp",0],sinh:["NamedOp",0],sup:"NamedOp",tan:["NamedOp",0],tanh:["NamedOp",0],limits:["Limits",1],nolimits:["Limits",0],overline:["UnderOver","203E"],underline:["UnderOver","005F"],overbrace:["UnderOver","23DE",1],underbrace:["UnderOver","23DF",1],overrightarrow:["UnderOver","2192"],underrightarrow:["UnderOver","2192"],overleftarrow:["UnderOver","2190"],underleftarrow:["UnderOver","2190"],overleftrightarrow:["UnderOver","2194"],underleftrightarrow:["UnderOver","2194"],overset:"Overset",underset:"Underset",stackrel:["Macro","\\mathrel{\\mathop{#2}\\limits^{#1}}",2],over:"Over",overwithdelims:"Over",atop:"Over",atopwithdelims:"Over",above:"Over",abovewithdelims:"Over",brace:["Over","{","}"],brack:["Over","[","]"],choose:["Over","(",")"],frac:"Frac",sqrt:"Sqrt",root:"Root",uproot:["MoveRoot","upRoot"],leftroot:["MoveRoot","leftRoot"],left:"LeftRight",right:"LeftRight",llap:"Lap",rlap:"Lap",raise:"RaiseLower",lower:"RaiseLower",moveleft:"MoveLeftRight",moveright:"MoveLeftRight",",":["Spacer",i.LENGTH.THINMATHSPACE],":":["Spacer",i.LENGTH.THINMATHSPACE],">":["Spacer",i.LENGTH.MEDIUMMATHSPACE],";":["Spacer",i.LENGTH.THICKMATHSPACE],"!":["Spacer",i.LENGTH.NEGATIVETHINMATHSPACE],enspace:["Spacer",".5em"],quad:["Spacer","1em"],qquad:["Spacer","2em"],thinspace:["Spacer",i.LENGTH.THINMATHSPACE],negthinspace:["Spacer",i.LENGTH.NEGATIVETHINMATHSPACE],hskip:"Hskip",hspace:"Hskip",kern:"Hskip",mskip:"Hskip",mspace:"Hskip",mkern:"Hskip",Rule:["Rule"],Space:["Rule","blank"],big:["MakeBig",i.TEXCLASS.ORD,0.85],Big:["MakeBig",i.TEXCLASS.ORD,1.15],bigg:["MakeBig",i.TEXCLASS.ORD,1.45],Bigg:["MakeBig",i.TEXCLASS.ORD,1.75],bigl:["MakeBig",i.TEXCLASS.OPEN,0.85],Bigl:["MakeBig",i.TEXCLASS.OPEN,1.15],biggl:["MakeBig",i.TEXCLASS.OPEN,1.45],Biggl:["MakeBig",i.TEXCLASS.OPEN,1.75],bigr:["MakeBig",i.TEXCLASS.CLOSE,0.85],Bigr:["MakeBig",i.TEXCLASS.CLOSE,1.15],biggr:["MakeBig",i.TEXCLASS.CLOSE,1.45],Biggr:["MakeBig",i.TEXCLASS.CLOSE,1.75],bigm:["MakeBig",i.TEXCLASS.REL,0.85],Bigm:["MakeBig",i.TEXCLASS.REL,1.15],biggm:["MakeBig",i.TEXCLASS.REL,1.45],Biggm:["MakeBig",i.TEXCLASS.REL,1.75],mathord:["TeXAtom",i.TEXCLASS.ORD],mathop:["TeXAtom",i.TEXCLASS.OP],mathopen:["TeXAtom",i.TEXCLASS.OPEN],mathclose:["TeXAtom",i.TEXCLASS.CLOSE],mathbin:["TeXAtom",i.TEXCLASS.BIN],mathrel:["TeXAtom",i.TEXCLASS.REL],mathpunct:["TeXAtom",i.TEXCLASS.PUNCT],mathinner:["TeXAtom",i.TEXCLASS.INNER],vcenter:["TeXAtom",i.TEXCLASS.VCENTER],mathchoice:["Extension","mathchoice"],buildrel:"BuildRel",hbox:["HBox",0],text:"HBox",mbox:["HBox",0],fbox:"FBox",strut:"Strut",mathstrut:["Macro","\\vphantom{(}"],phantom:"Phantom",vphantom:["Phantom",1,0],hphantom:["Phantom",0,1],smash:"Smash",acute:["Accent","02CA"],grave:["Accent","02CB"],ddot:["Accent","00A8"],tilde:["Accent","02DC"],bar:["Accent","02C9"],breve:["Accent","02D8"],check:["Accent","02C7"],hat:["Accent","02C6"],vec:["Accent","20D7"],dot:["Accent","02D9"],widetilde:["Accent","02DC",1],widehat:["Accent","02C6",1],matrix:"Matrix",array:"Matrix",pmatrix:["Matrix","(",")"],cases:["Matrix","{","","left left",null,".1em"],eqalign:["Matrix",null,null,"right left",i.LENGTH.THICKMATHSPACE,".5em","D"],displaylines:["Matrix",null,null,"center",null,".5em","D"],cr:"Cr","\\":"Cr",newline:"Cr",hline:["HLine","solid"],hdashline:["HLine","dashed"],eqalignno:["Matrix",null,null,"right left right",i.LENGTH.THICKMATHSPACE+" 3em",".5em","D"],leqalignno:["Matrix",null,null,"right left right",i.LENGTH.THICKMATHSPACE+" 3em",".5em","D"],bmod:["Macro","\\mathbin{\\rm mod}"],pmod:["Macro","\\pod{{\\rm mod}\\kern 6mu #1}",1],mod:["Macro","\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}{\\rm mod}\\,\\,#1",1],pod:["Macro","\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)",1],iff:["Macro","\\;\\Longleftrightarrow\\;"],skew:["Macro","{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}",3],mathcal:["Macro","{\\cal #1}",1],mathscr:["Macro","{\\scr #1}",1],mathrm:["Macro","{\\rm #1}",1],mathbf:["Macro","{\\bf #1}",1],mathbb:["Macro","{\\bbFont #1}",1],Bbb:["Macro","{\\bbFont #1}",1],mathit:["Macro","{\\it #1}",1],mathfrak:["Macro","{\\frak #1}",1],mathsf:["Macro","{\\sf #1}",1],mathtt:["Macro","{\\tt #1}",1],textrm:["Macro","\\mathord{\\rm\\text{#1}}",1],textit:["Macro","\\mathord{\\it{\\text{#1}}}",1],textbf:["Macro","\\mathord{\\bf{\\text{#1}}}",1],pmb:["Macro","\\rlap{#1}\\kern1px{#1}",1],TeX:["Macro","T\\kern-.14em\\lower.5ex{E}\\kern-.115em X"],LaTeX:["Macro","L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX"],not:["Macro","\\mathrel{\\rlap{\\kern.5em\\notChar}}"]," ":["Macro","\\text{ }"],space:"Tilde",begin:"Begin",end:"End",newcommand:["Extension","newcommand"],renewcommand:["Extension","newcommand"],newenvironment:["Extension","newcommand"],def:["Extension","newcommand"],verb:["Extension","verb"],boldsymbol:["Extension","boldsymbol"],tag:["Extension","AMSmath"],notag:["Extension","AMSmath"],label:["Extension","AMSmath"],ref:["Extension","AMSmath"],eqref:["Extension","AMSmath"],nonumber:["Macro","\\notag"],unicode:["Extension","unicode"],color:"Color",href:["Extension","HTML"],"class":["Extension","HTML"],style:["Extension","HTML"],cssId:["Extension","HTML"],require:"Require"},environment:{array:["Array"],matrix:["Array",null,null,null,"c"],pmatrix:["Array",null,"(",")","c"],bmatrix:["Array",null,"[","]","c"],Bmatrix:["Array",null,"\\{","\\}","c"],vmatrix:["Array",null,"\\vert","\\vert","c"],Vmatrix:["Array",null,"\\Vert","\\Vert","c"],cases:["Array",null,"\\{",".","ll",null,".1em"],eqnarray:["Array",null,null,null,"rcl",i.LENGTH.THICKMATHSPACE,".5em","D"],"eqnarray*":["Array",null,null,null,"rcl",i.LENGTH.THICKMATHSPACE,".5em","D"],equation:[null,"Equation"],"equation*":[null,"Equation"],align:["ExtensionEnv",null,"AMSmath"],"align*":["ExtensionEnv",null,"AMSmath"],aligned:["ExtensionEnv",null,"AMSmath"],multline:["ExtensionEnv",null,"AMSmath"],"multline*":["ExtensionEnv",null,"AMSmath"],split:["ExtensionEnv",null,"AMSmath"],gather:["ExtensionEnv",null,"AMSmath"],"gather*":["ExtensionEnv",null,"AMSmath"],gathered:["ExtensionEnv",null,"AMSmath"],alignat:["ExtensionEnv",null,"AMSmath"],"alignat*":["ExtensionEnv",null,"AMSmath"],alignedat:["ExtensionEnv",null,"AMSmath"]},p_height:1.2/0.85});if(this.config.Macros){var k=this.config.Macros;for(var l in k){if(k.hasOwnProperty(l)){if(typeof(k[l])==="string"){g.macros[l]=["Macro",k[l]]}else{g.macros[l]=["Macro"].concat(k[l])}}}}};var a=MathJax.Object.Subclass({Init:function(l,m){this.string=l;this.i=0;this.macroCount=0;var k;if(m){k={};for(var n in m){if(m.hasOwnProperty(n)){k[n]=m[n]}}}this.stack=d.Stack(k,!!m);this.Parse();this.Push(b.stop())},Parse:function(){var k;while(this.i<this.string.length){k=this.string.charAt(this.i++);if(g.special[k]){this[g.special[k]](k)}else{if(g.letter.test(k)){this.Variable(k)}else{if(g.digit.test(k)){this.Number(k)}else{this.Other(k)}}}}},Push:function(){this.stack.Push.apply(this.stack,arguments)},mml:function(){if(this.stack.Top().type!=="mml"){return null}return this.stack.Top().data[0]},mmlToken:function(k){return k},ControlSequence:function(q){var k=this.GetCS(),p,n;if(g.macros[k]){var m=g.macros[k];if(!(m instanceof Array)){m=[m]}var l=m[0];if(!(l instanceof Function)){l=this[l]}l.apply(this,["\\"+k].concat(m.slice(1)))}else{if(g.mathchar0mi[k]){p=g.mathchar0mi[k];n={mathvariant:i.VARIANT.ITALIC};if(p instanceof Array){n=p[1];p=p[0]}this.Push(this.mmlToken(i.mi(i.entity("#x"+p)).With(n)))}else{if(g.mathchar0mo[k]){p=g.mathchar0mo[k];n={stretchy:f};if(p instanceof Array){n=p[1];n.stretchy=f;p=p[0]}this.Push(this.mmlToken(i.mo(i.entity("#x"+p)).With(n)))}else{if(g.mathchar7[k]){p=g.mathchar7[k];n={mathvariant:i.VARIANT.NORMAL};if(p instanceof Array){n=p[1];p=p[0]}if(this.stack.env.font){n.mathvariant=this.stack.env.font}this.Push(this.mmlToken(i.mi(i.entity("#x"+p)).With(n)))}else{if(g.delimiter["\\"+k]!=null){var o=g.delimiter["\\"+k];n={};if(o instanceof Array){n=o[1];o=o[0]}if(o.length===4){o=i.entity("#x"+o)}else{o=i.chars(o)}this.Push(this.mmlToken(i.mo(o).With({fence:f,stretchy:f}).With(n)))}else{this.csUndefined("\\"+k)}}}}}},csUndefined:function(k){d.Error("Undefined control sequence "+k)},Variable:function(l){var k={};if(this.stack.env.font){k.mathvariant=this.stack.env.font}this.Push(this.mmlToken(i.mi(i.chars(l)).With(k)))},Number:function(m){var k,l=this.string.slice(this.i-1).match(g.number);if(l){k=i.mn(l[0].replace(/[{}]/g,""));this.i+=l[0].length-1}else{k=i.mo(i.chars(m))}if(this.stack.env.font){k.mathvariant=this.stack.env.font}this.Push(this.mmlToken(k))},Open:function(k){this.Push(b.open())},Close:function(k){this.Push(b.close())},Tilde:function(k){this.Push(i.mtext(i.chars(h)))},Space:function(k){},Superscript:function(m){var k,l=this.stack.Prev();if(!l){l=i.mi("")}if(l.isEmbellishedWrapper){l=l.data[0].data[0]}if(l.type==="msubsup"){if(l.data[l.sup]){if(!l.data[l.sup].isPrime){d.Error("Double exponent: use braces to clarify")}l=i.msubsup(l,null,null)}k=l.sup}else{if(l.movesupsub){if(l.type!=="munderover"||l.data[l.over]){l=i.munderover(l,null,null).With({movesupsub:c})}k=l.over}else{l=i.msubsup(l,null,null);k=l.sup}}this.Push(b.subsup(l).With({position:k}))},Subscript:function(m){var k,l=this.stack.Prev();if(!l){l=i.mi("")}if(l.isEmbellishedWrapper){l=l.data[0].data[0]}if(l.type==="msubsup"){if(l.data[l.sub]){d.Error("Double subscripts: use braces to clarify")}k=l.sub}else{if(l.movesupsub){if(l.type!=="munderover"||l.data[l.under]){l=i.munderover(l,null,null).With({movesupsub:c})}k=l.under}else{l=i.msubsup(l,null,null);k=l.sub}}this.Push(b.subsup(l).With({position:k}))},PRIME:String.fromCharCode(8242),SMARTQUOTE:String.fromCharCode(8217),Prime:function(m){var l=this.stack.Prev();if(!l){l=i.mi()}if(l.type==="msubsup"&&l.data[l.sup]){d.Error("Prime causes double exponent: use braces to clarify")}var k="";this.i--;do{k+=this.PRIME;this.i++,m=this.GetNext()}while(m==="'"||m===this.SMARTQUOTE);k=this.mmlToken(i.mo(i.chars(k)).With({isPrime:c,variantForm:d.isSTIX}));this.Push(i.msubsup(l,null,k))},Comment:function(k){while(this.i<this.string.length&&this.string.charAt(this.i)!="\n"){this.i++}},Hash:function(k){d.Error("You can't use 'macro parameter character #' in math mode")},Other:function(m){var l={stretchy:false},k;if(this.stack.env.font){l.mathvariant=this.stack.env.font}if(g.remap[m]){m=g.remap[m];if(m instanceof Array){l=m[1];m=m[0]}k=i.mo(i.entity("#x"+m))}else{k=i.mo(m)}if(k.autoDefault("texClass",true)==""){k=i.TeXAtom(k)}this.Push(this.mmlToken(k.With(l)))},SetFont:function(l,k){this.stack.env.font=k},SetStyle:function(l,k,m,n){this.stack.env.style=k;this.stack.env.level=n;this.Push(b.style().With({styles:{displaystyle:m,scriptlevel:n}}))},SetSize:function(k,l){this.stack.env.size=l;this.Push(b.style().With({styles:{mathsize:l+"em"}}))},Color:function(m){var l=this.GetArgument(m);var k=this.stack.env.color;this.stack.env.color=l;var n=this.ParseArg(m);if(k){this.stack.env.color}else{delete this.stack.env.color}this.Push(i.mstyle(n).With({mathcolor:l}))},Spacer:function(k,l){this.Push(i.mspace().With({width:l,mathsize:i.SIZE.NORMAL,scriptlevel:1}))},LeftRight:function(k){this.Push(b[k.substr(1)]().With({delim:this.GetDelimiter(k)}))},NamedOp:function(m,l,o){var n=(l!=null&&l===0?f:c);if(!o){o=m.substr(1)}l=((l||l==null)?c:f);o=o.replace(/&thinsp;/,String.fromCharCode(8198));var k=i.mo(o).With({movablelimits:l,movesupsub:n,form:i.FORM.PREFIX,texClass:i.TEXCLASS.OP});k.useMMLspacing&=~k.SPACE_ATTR.form;this.Push(this.mmlToken(k))},Limits:function(l,k){var m=this.stack.Prev("nopop");if(m.texClass!==i.TEXCLASS.OP){d.Error(l+" is allowed only on operators")}m.movesupsub=(k?c:f);m.movablelimits=f},Over:function(m,l,n){var k=b.over().With({name:m});if(l||n){k.open=l;k.close=n}else{if(m.match(/withdelims$/)){k.open=this.GetDelimiter(m);k.close=this.GetDelimiter(m)}}if(m.match(/^\\above/)){k.thickness=this.GetDimen(m)}else{if(m.match(/^\\atop/)||l||n){k.thickness=0}}this.Push(k)},Frac:function(l){var k=this.ParseArg(l);var m=this.ParseArg(l);this.Push(i.mfrac(k,m))},Sqrt:function(l){var m=this.GetBrackets(l),k=this.ParseArg(l);if(m==""){k=i.msqrt.apply(i,k.array())}else{k=i.mroot(k,this.parseRoot(m))}this.Push(k)},Root:function(l){var m=this.GetUpTo(l,"\\of");var k=this.ParseArg(l);this.Push(i.mroot(k,this.parseRoot(m)))},parseRoot:function(p){var l=this.stack.env,k=l.inRoot;l.inRoot=true;var o=d.Parse(p,l);p=o.mml();var m=o.stack.global;if(m.leftRoot||m.upRoot){p=i.mpadded(p);if(m.leftRoot){p.width=m.leftRoot}if(m.upRoot){p.voffset=m.upRoot;p.height=m.upRoot}}l.inRoot=k;return p},MoveRoot:function(k,m){if(!this.stack.env.inRoot){d.Error(k+" can appear only within a root")}if(this.stack.global[m]){d.Error("Multiple use of "+k)}var l=this.GetArgument(k);if(!l.match(/-?[0-9]+/)){d.Error("The argument to "+k+" must be an integer")}l=(l/15)+"em";if(l.substr(0,1)!=="-"){l="+"+l}this.stack.global[m]=l},Accent:function(m,k,p){var o=this.ParseArg(m);var n={accent:true};if(this.stack.env.font){n.mathvariant=this.stack.env.font}var l=this.mmlToken(i.mo(i.entity("#x"+k)).With(n));l.stretchy=(p?c:f);this.Push(i.munderover(o,null,l).With({accent:c}))},UnderOver:function(m,p,k){var o={o:"over",u:"under"}[m.charAt(1)];var n=this.ParseArg(m);if(n.Get("movablelimits")){n.movablelimits=false}var l=i.munderover(n,null,null);if(k){l.movesupsub=c}l.data[l[o]]=this.mmlToken(i.mo(i.entity("#x"+p)).With({stretchy:c,accent:(o=="under")}));this.Push(l)},Overset:function(k){var m=this.ParseArg(k),l=this.ParseArg(k);this.Push(i.munderover(l,null,m))},Underset:function(k){var m=this.ParseArg(k),l=this.ParseArg(k);this.Push(i.munderover(l,m,null))},TeXAtom:function(n,p){var o={texClass:p},m;if(p==i.TEXCLASS.OP){o.movesupsub=o.movablelimits=c;var k=this.GetArgument(n);var l=k.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);if(l){m=this.mmlToken(i.mo(l[1]).With({movablelimits:c,movesupsub:c,mathvariant:i.VARIANT.NORMAL,form:i.FORM.PREFIX,texClass:i.TEXCLASS.OP}));m.useMMLspacing&=~m.SPACE_ATTR.form}else{m=i.TeXAtom(d.Parse(k,this.stack.env).mml()).With(o)}}else{m=i.TeXAtom(this.ParseArg(n)).With(o)}this.Push(m)},Strut:function(k){this.Push(i.mpadded(i.mrow()).With({height:"8.6pt",depth:"3pt",width:0}))},Phantom:function(l,k,m){var n=i.mphantom(this.ParseArg(l));if(k||m){n=i.mpadded(n);if(m){n.height=n.depth=0}if(k){n.width=0}}this.Push(n)},Smash:function(m){var l=this.trimSpaces(this.GetBrackets(m));var k=i.mpadded(this.ParseArg(m));switch(l){case"b":k.depth=0;break;case"t":k.height=0;break;default:k.height=k.depth=0}this.Push(k)},Lap:function(l){var k=i.mpadded(this.ParseArg(l)).With({width:0});if(l==="\\llap"){k.lspace="-1 width"}this.Push(k)},RaiseLower:function(k){var l=this.GetDimen(k);var m=b.position().With({name:k,move:"vertical"});if(l.charAt(0)==="-"){l=l.slice(1);k={raise:"\\lower",lower:"\\raise"}[k.substr(1)]}if(k==="\\lower"){m.dh="-"+l;m.dd="+"+l}else{m.dh="+"+l;m.dd="-"+l}this.Push(m)},MoveLeftRight:function(k){var n=this.GetDimen(k);var m=(n.charAt(0)==="-"?n.slice(1):"-"+n);if(k==="\\moveleft"){var l=n;n=m;m=l}this.Push(b.position().With({name:k,move:"horizontal",left:i.mspace().With({width:n,mathsize:i.SIZE.NORMAL,scriptlevel:1}),right:i.mspace().With({width:m,mathsize:i.SIZE.NORMAL,scriptlevel:1})}))},Hskip:function(k){this.Push(i.mspace().With({width:this.GetDimen(k),mathsize:i.SIZE.NORMAL,scriptlevel:0}))},Rule:function(m,o){var k=this.GetDimen(m),n=this.GetDimen(m),q=this.GetDimen(m);var l,p={width:k,height:n,depth:q};if(o!=="blank"){l=i.mpadded(i.mrow()).With(p);if(parseFloat(k)&&parseFloat(n)+parseFloat(q)){l=i.mstyle(l).With({mathbackground:(this.stack.env.color||"black")})}}else{l=i.mspace().With(p)}this.Push(l)},MakeBig:function(k,n,l){l*=g.p_height;l=String(l).replace(/(\.\d\d\d).+/,"$1")+"em";var m=this.GetDelimiter(k);this.Push(i.TeXAtom(i.mo(m).With({minsize:l,maxsize:l,scriptlevel:0,fence:c,stretchy:c,symmetric:c})).With({texClass:n}))},BuildRel:function(k){var l=this.ParseUpTo(k,"\\over");var m=this.ParseArg(k);this.Push(i.TeXAtom(i.munderover(m,null,l)).With({mclass:i.TEXCLASS.REL}))},HBox:function(k,l){this.Push.apply(this,this.InternalMath(this.GetArgument(k),l))},FBox:function(k){this.Push(i.menclose.apply(i,this.InternalMath(this.GetArgument(k))).With({notation:"box"}))},Require:function(k){var l=this.GetArgument(k);this.Extension(null,l)},Extension:function(k,l,m){if(k&&!typeof(k)==="string"){k=k.name}l=d.extensionDir+"/"+l;if(!l.match(/\.js$/)){l+=".js"}if(!MathJax.Ajax.loaded[MathJax.Ajax.fileURL(l)]){if(k!=null){delete g[m||"macros"][k.replace(/^\\/,"")]}MathJax.Hub.RestartAfter(MathJax.Ajax.Require(l))}},Macro:function(l,o,n){if(n){var k=[];for(var m=0;m<n;m++){k.push(this.GetArgument(l))}o=this.SubstituteArgs(k,o)}this.string=this.AddArgs(o,this.string.slice(this.i));this.i=0;if(++this.macroCount>d.config.MAXMACROS){d.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?")}},Matrix:function(l,n,s,p,q,m,k){var r=this.GetNext();if(r===""){d.Error("Missing argument for "+l)}if(r==="{"){this.i++}else{this.string=r+"}"+this.string.slice(this.i+1);this.i=0}var o=b.array().With({requireClose:c,arraydef:{rowspacing:(m||"4pt"),columnspacing:(q||"1em")}});if(n||s){o.open=n;o.close=s}if(k==="D"){o.arraydef.displaystyle=c}if(p!=null){o.arraydef.columnalign=p}this.Push(o)},Entry:function(k){this.Push(b.cell().With({isEntry:c,name:k}))},Cr:function(k){this.Push(b.cell().With({isCR:c,name:k}))},HLine:function(l,m){if(m==null){m="solid"}var n=this.stack.Top();if(n.type!=="array"||n.data.length){d.Error("Misplaced "+l)}if(n.table.length==0){n.arraydef.frame=m}else{var k=(n.arraydef.rowlines?n.arraydef.rowlines.split(/ /):[]);while(k.length<n.table.length){k.push("none")}k[n.table.length-1]=m;n.arraydef.rowlines=k.join(" ")}},Begin:function(l){var m=this.GetArgument(l);if(m.match(/[^a-z*]/i)){d.Error('Invalid environment name "'+m+'"')}if(!g.environment[m]){d.Error('Unknown environment "'+m+'"')}if(++this.macroCount>d.config.MAXMACROS){d.Error("MathJax maximum substitution count exceeded; is there a recursive latex environment?")}var n=g.environment[m];if(!(n instanceof Array)){n=[n]}var k=b.begin().With({name:m,end:n[1],parse:this});if(n[0]&&this[n[0]]){k=this[n[0]].apply(this,[k].concat(n.slice(2)))}this.Push(k)},End:function(k){this.Push(b.end().With({name:this.GetArgument(k)}))},Equation:function(k,l){return l},ExtensionEnv:function(l,k){this.Extension(l.name,k,"environment")},Array:function(m,o,t,r,s,n,k,p){if(!r){r=this.GetArgument("\\begin{"+m.name+"}")}var u=("c"+r).replace(/[^clr|:]/g,"").replace(/[^|:]([|:])+/g,"$1");r=r.replace(/[^clr]/g,"").split("").join(" ");r=r.replace(/l/g,"left").replace(/r/g,"right").replace(/c/g,"center");var q=b.array().With({arraydef:{columnalign:r,columnspacing:(s||"1em"),rowspacing:(n||"4pt")}});if(u.match(/[|:]/)){var l=(u.charAt(0)+u.charAt(u.length-1)).replace(/[^|:]/g,"");if(l!==""){q.arraydef.frame={"|":"solid",":":"dashed"}[l.charAt(0)];q.arraydef.framespacing=".5em .5ex"}u=u.substr(1,u.length-2);q.arraydef.columnlines=u.split("").join(" ").replace(/[^|: ]/g,"none").replace(/\|/g,"solid").replace(/:/g,"dashed")}if(o){q.open=this.convertDelimiter(o)}if(t){q.close=this.convertDelimiter(t)}if(k==="D"){q.arraydef.displaystyle=c}if(k==="S"){q.arraydef.scriptlevel=1}if(p){q.arraydef.useHeight=f}this.Push(m);return q},convertDelimiter:function(k){if(k){k=g.delimiter[k]}if(k==null){return null}if(k instanceof Array){k=k[0]}if(k.length===4){k=String.fromCharCode(parseInt(k,16))}return k},trimSpaces:function(k){if(typeof(k)!="string"){return k}return k.replace(/^\s+|\s+$/g,"")},nextIsSpace:function(){return this.string.charAt(this.i).match(/[ \n\r\t]/)},GetNext:function(){while(this.nextIsSpace()){this.i++}return this.string.charAt(this.i)},GetCS:function(){var k=this.string.slice(this.i).match(/^([a-z]+|.) ?/i);if(k){this.i+=k[1].length;return k[1]}else{this.i++;return" "}},GetArgument:function(l,m){switch(this.GetNext()){case"":if(!m){d.Error("Missing argument for "+l)}return null;case"}":if(!m){d.Error("Extra close brace or missing open brace")}return null;case"\\":this.i++;return"\\"+this.GetCS();case"{":var k=++this.i,n=1;while(this.i<this.string.length){switch(this.string.charAt(this.i++)){case"\\":this.i++;break;case"{":n++;break;case"}":if(n==0){d.Error("Extra close brace")}if(--n==0){return this.string.slice(k,this.i-1)}break}}d.Error("Missing close brace");break}return this.string.charAt(this.i++)},GetBrackets:function(l){if(this.GetNext()!="["){return""}var k=++this.i,m=0;while(this.i<this.string.length){switch(this.string.charAt(this.i++)){case"{":m++;break;case"\\":this.i++;break;case"}":if(m--<=0){d.Error("Extra close brace while looking for ']'")}break;case"]":if(m==0){return this.string.slice(k,this.i-1)}break}}d.Error("Couldn't find closing ']' for argument to "+l)},GetDelimiter:function(k){while(this.nextIsSpace()){this.i++}var l=this.string.charAt(this.i);if(this.i<this.string.length){this.i++;if(l=="\\"){l+=this.GetCS(k)}if(g.delimiter[l]!=null){return this.convertDelimiter(l)}}d.Error("Missing or unrecognized delimiter for "+k)},GetDimen:function(l){var m;if(this.nextIsSpace()){this.i++}if(this.string.charAt(this.i)=="{"){m=this.GetArgument(l);if(m.match(/^\s*([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)){return m.replace(/ /g,"")}}else{m=this.string.slice(this.i);var k=m.match(/^\s*(([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);if(k){this.i+=k[0].length;return k[1].replace(/ /g,"")}}d.Error("Missing dimension or its units for "+l)},GetUpTo:function(n,o){while(this.nextIsSpace()){this.i++}var m=this.i,l,q,p=0;while(this.i<this.string.length){l=this.i;q=this.string.charAt(this.i++);switch(q){case"\\":q+=this.GetCS();break;case"{":p++;break;case"}":if(p==0){d.Error("Extra close brace while looking for "+o)}p--;break}if(p==0&&q==o){return this.string.slice(m,l)}}d.Error("Couldn't find "+o+" for "+n)},ParseArg:function(k){return d.Parse(this.GetArgument(k),this.stack.env).mml()},ParseUpTo:function(k,l){return d.Parse(this.GetUpTo(k,l),this.stack.env).mml()},InternalMath:function(q,s){var p={displaystyle:f};if(s!=null){p.scriptlevel=s}if(this.stack.env.font){p.mathvariant=this.stack.env.font}if(!q.match(/\$|\\\(|\\(eq)?ref\s*\{/)){return[this.InternalText(q,p)]}var o=0,l=0,r,n="";var m=[];while(o<q.length){r=q.charAt(o++);if(r==="$"){if(n==="$"){m.push(i.TeXAtom(d.Parse(q.slice(l,o-1),{}).mml().With(p)));n="";l=o}else{if(n===""){if(l<o-1){m.push(this.InternalText(q.slice(l,o-1),p))}n="$";l=o}}}else{if(r==="}"&&n==="}"){m.push(i.TeXAtom(d.Parse(q.slice(l,o),{}).mml().With(p)));n="";l=o+1}else{if(r==="\\"){if(n===""&&q.substr(o).match(/^(eq)?ref\s*\{/)){if(l<o-1){m.push(this.InternalText(q.slice(l,o-1),p))}n="}";l=o-1}else{r=q.charAt(o++);if(r==="("&&n===""){if(l<o-2){m.push(this.InternalText(q.slice(l,o-2),p))}n=")";l=o}else{if(r===")"&&n===")"){m.push(i.TeXAtom(d.Parse(q.slice(l,o-2),{}).mml().With(p)));n="";l=o}}}}}}}if(n!==""){d.Error("Math not terminated in text box")}if(l<q.length){m.push(this.InternalText(q.slice(l),p))}return m},InternalText:function(l,k){l=l.replace(/^\s+/,h).replace(/\s+$/,h);return i.mtext(i.chars(l)).With(k)},SubstituteArgs:function(l,k){var o="";var n="";var p;var m=0;while(m<k.length){p=k.charAt(m++);if(p==="\\"){o+=p+k.charAt(m++)}else{if(p==="#"){p=k.charAt(m++);if(p==="#"){o+=p}else{if(!p.match(/[1-9]/)||p>l.length){d.Error("Illegal macro parameter reference")}n=this.AddArgs(this.AddArgs(n,o),l[p-1]);o=""}}else{o+=p}}}return this.AddArgs(n,o)},AddArgs:function(l,k){if(k.match(/^[a-z]/i)&&l.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)){l+=" "}if(l.length+k.length>d.config.MAXBUFFER){d.Error("MathJax internal buffer size exceeded; is there a recursive macro call?")}return l+k}});d.Augment({Stack:e,Parse:a,Definitions:g,Startup:j,config:{MAXMACROS:10000,MAXBUFFER:5*1024},prefilterHooks:MathJax.Callback.Hooks(true),postfilterHooks:MathJax.Callback.Hooks(true),Translate:function(k){var l,m=false;var o=k.innerHTML.replace(/^\s+/,"").replace(/\s+$/,"");var q=(k.type.replace(/\n/g," ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/)!=null);var p={math:o,display:q,script:k};this.prefilterHooks.Execute(p);o=p.math;try{l=d.Parse(o).mml()}catch(n){if(!n.texError){throw n}l=this.formatError(n,o,q,k);m=true}if(l.inferred){l=i.apply(MathJax.ElementJax,l.data)}else{l=i(l)}if(q){l.root.display="block"}if(m){l.texError=true}p.math=l;this.postfilterHooks.Execute(p);return p.math},prefilterMath:function(k){if(MathJax.Hub.Browser.isKonqueror){k.math=k.math.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}k.math=k.math.replace(/([_^]\s*\d)([0-9.,])/g,"$1 $2")},postfilterMath:function(k){this.combineRelations(k.math.root)},formatError:function(m,l,n,k){return i.merror(m.message.replace(/\n.*/,""))},Error:function(k){throw MathJax.Hub.Insert(Error(k),{texError:c})},Macro:function(k,l,m){g.macros[k]=["Macro"].concat([].slice.call(arguments,1))},combineRelations:function(l){for(var n=0,k=l.data.length;n<k;n++){if(l.data[n]){if(l.isa(i.mrow)){while(n+1<k&&l.data[n+1]&&l.data[n].isa(i.mo)&&l.data[n+1].isa(i.mo)&&l.data[n].Get("texClass")===i.TEXCLASS.REL&&l.data[n+1].Get("texClass")===i.TEXCLASS.REL){l.data[n].Append.apply(l.data[n],l.data[n+1].data);l.data.splice(n+1,1);k--}}if(!l.data[n].isToken){this.combineRelations(l.data[n])}}}}});d.prefilterHooks.Add(["prefilterMath",d]);d.postfilterHooks.Add(["postfilterMath",d]);d.loadComplete("jax.js")})(MathJax.InputJax.TeX);

