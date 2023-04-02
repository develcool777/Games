var S=Object.defineProperty;var $=(s,e,t)=>e in s?S(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var r=(s,e,t)=>($(s,typeof e!="symbol"?e+"":e,t),t);import{M as x}from"./Main-445f4aac.js";import{d as y,_ as g,c as u,a as v,w as m,T as M,o as i,h as b,F as C,i as T,e as k,p as B,f as w,g as c,r as f,j as l,k as z}from"./index-0b9fe5c4.js";const G=y({name:"Cell",props:{cell:{type:String,required:!0}},setup(){return{}}});const E={class:"cell"},I={key:0,class:"cell__o"},F={key:0,class:"cell__x"};function D(s,e,t,a,o,n){return i(),u("div",E,[v(M,{name:"fade"},{default:m(()=>[s.cell==="o"?(i(),u("div",I)):b("",!0)]),_:1}),v(M,{name:"fade"},{default:m(()=>[s.cell==="x"?(i(),u("div",F)):b("",!0)]),_:1})])}const L=g(G,[["render",D],["__scopeId","data-v-7ba42741"]]),N=y({name:"Board",components:{Cell:L},props:{board:{type:Object,required:!0}},emits:["makeMove"],setup(s,e){return{makeMove:a=>e.emit("makeMove",a)}}});const d=s=>(B("data-v-5c19f0f7"),s=s(),w(),s),R={class:"field"},V=d(()=>c("div",{class:"field__line v1"},null,-1)),j=d(()=>c("div",{class:"field__line v2"},null,-1)),q=d(()=>c("div",{class:"field__line horizontal h1"},null,-1)),A=d(()=>c("div",{class:"field__line horizontal h2"},null,-1));function U(s,e,t,a,o,n){const p=f("Cell");return i(),u("section",R,[(i(!0),u(C,null,T(s.board.flat(),(_,h)=>(i(),k(p,{cell:_,key:h,onClick:J=>s.makeMove(h)},null,8,["cell","onClick"]))),128)),V,j,q,A])}const W=g(N,[["render",U],["__scopeId","data-v-5c19f0f7"]]);class H{constructor(){r(this,"player");r(this,"board");r(this,"boardSize");r(this,"result");r(this,"history");r(this,"computer");r(this,"gameStatus");r(this,"index1DTo2D",e=>({x:Math.floor(e/this.boardSize.value),y:e%this.boardSize.value}));r(this,"userMove",e=>{if(this.gameStatus.value!=="start")throw Error("Game is not started");if(this.board.value[e.x][e.y]===void 0)throw Error("Wrong coordinates");if(this.board.value[e.x][e.y]!=="")throw Error("Cell is not empty");this.makeMove(e),this.computer.value.isComp&&this.compMove(),this.result.value!==""&&this.finishGame()});r(this,"makeMove",e=>{this.board.value[e.x][e.y]=this.player.value,this.history.push({...e,value:this.player.value}),this.player.value=this.player.value==="x"?"o":"x",this.result.value=this.defineResult()});r(this,"compMove",()=>{if(this.result.value!=="")return;const e=this.getAvailableMoves;switch(this.computer.value.mode){case"easy":return this.makeMove(e[Math.floor(Math.random()*e.length)]);case"hard":return this.makeMove(e[Math.floor(Math.random()*e.length)])}});r(this,"reset",()=>{this.player.value="x",this.result.value="",this.board.value=[["","",""],["","",""],["","",""]],this.history=[]});r(this,"returnMove",()=>{var e,t;if(this.gameStatus.value!=="start")throw Error("Game is not started");if(this.history.length===0)throw Error("History is empty");this.history.pop(),this.computer.value.isComp&&this.history.length!==0&&(this.computer.value.isFirst?"x":"o")!==((e=this.history.at(-1))==null?void 0:e.value)&&this.history.pop(),this.player.value=((t=this.history.at(-1))==null?void 0:t.value)??"x"});r(this,"defineResult",()=>{if(this.history.length<5)return"";const e=(a,o,n)=>a===o&&o===n&&a!=="",t=this.board.value;return e(...t[0])?t[0][0]:e(...t[1])?t[1][0]:e(...t[2])?t[2][0]:e(...t.map(a=>a[0]))?t[0][0]:e(...t.map(a=>a[1]))?t[0][1]:e(...t.map(a=>a[2]))?t[0][2]:e(t[0][0],t[1][1],t[2][2])||e(t[0][2],t[1][1],t[0][2])?t[1][1]:this.history.length===this.board.value.length?"d":""});r(this,"startGame",()=>{this.gameStatus.value="start",this.computer.value.isComp&&this.computer.value.isFirst&&this.compMove()});r(this,"finishGame",()=>{this.gameStatus.value="finish",this.reset()});this.player=l("x"),this.result=l(""),this.board=l([["","",""],["","",""],["","",""]]),this.computer=l({isComp:!1,isFirst:!1,mode:"easy"}),this.gameStatus=l(""),this.boardSize=l(3),this.history=[]}get getPlayer(){return this.player.value}get getBoard(){return this.board.value}get getBoardSize(){return this.boardSize.value}get getResult(){return this.result.value}get getGameStatus(){return this.gameStatus.value}get getAvailableMoves(){return this.board.value.reduce((e,t,a)=>(t.forEach((o,n)=>{o===""&&e.push({x:a,y:n})}),e),[])}}const O=y({name:"TicTacToe",components:{Main:x,Board:W},setup(){const s=new H;s.startGame(),z(()=>e());const e=()=>{console.log(s.getBoard)};return{g:s,makeMove:a=>{s.userMove(s.index1DTo2D(a))}}}});function P(s,e,t,a,o,n){const p=f("Board"),_=f("Main");return i(),k(_,{class:"tic"},{default:m(()=>[v(p,{board:s.g.getBoard,onMakeMove:e[0]||(e[0]=h=>s.makeMove(h))},null,8,["board"])]),_:1})}const Y=g(O,[["render",P],["__scopeId","data-v-b4bca440"]]);export{Y as default};