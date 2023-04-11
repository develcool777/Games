var b=Object.defineProperty;var c=(u,a,e)=>a in u?b(u,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[a]=e;var n=(u,a,e)=>(c(u,typeof a!="symbol"?a+"":a,e),e);(function(){"use strict";class u{constructor(e,t){n(this,"board");n(this,"boardSize");n(this,"score");n(this,"aiSide");n(this,"makeMove",e=>{switch(e){case"easy":return this.easyMove();case"hard":return this.hardMove()}});n(this,"isWin",e=>{const t=e.reduce((i,o)=>(i.length===this.getAmountOfWinCells||((o===""||i.length!==0&&i.at(-1)!==o)&&(i=[]),i.push(o)),i),[]);return t.length===this.getAmountOfWinCells?t[0]:""});n(this,"defineResult",()=>{if(this.getIsAvoidChecking)return"";for(let t=0;t<this.boardSize;t++){const i=this.isWin(this.board[t]);if(i!=="")return i}for(let t=0;t<this.boardSize;t++){const i=this.board.map(s=>s[t]),o=this.isWin(i);if(o!=="")return o}const e=this.getDiagonals;for(let t=0;t<e.length;t++){const i=this.isWin(e[t]);if(i!=="")return i}return this.getAmountOfMadeMoves===this.getAmoutOfCells?"d":""});n(this,"easyMove",()=>{const e=this.getAvailableMoves;return e[Math.floor(Math.random()*e.length)]});n(this,"hardMove",()=>{let e=-1/0,t=null;return this.getAvailableMoves.forEach(i=>{this.board[i.x][i.y]=this.aiSide;const o=this.minMax(0,-1/0,1/0,!1);this.board[i.x][i.y]="",o>e&&(t=i,e=o)}),t});n(this,"minMax",(e,t,i,o)=>{const s=this.defineResult();if(s!=="")return this.score[s];if(e===3)return 0;const r=this.getAvailableMoves;if(o){let h=-1/0;for(let d=0;d<r.length;d++){const f=r[d];this.board[f.x][f.y]=this.aiSide;const g=this.minMax(e+1,t,i,!1);if(this.board[f.x][f.y]="",h=Math.max(h,g),t=Math.max(t,h),i<=t)break}return h}let l=1/0;for(let h=0;h<r.length;h++){const d=r[h];this.board[d.x][d.y]=this.aiSide==="x"?"o":"x";const f=this.minMax(e+1,t,i,!0);if(this.board[d.x][d.y]="",l=Math.min(l,f),i=Math.min(i,l),i<=t)break}return l});this.board=JSON.parse(JSON.stringify(e)),this.boardSize=this.board.length,this.aiSide=t,this.score={x:t==="x"?10:-10,o:t==="o"?10:-10,d:0}}get getAmoutOfCells(){return Math.pow(this.boardSize,2)}get getDiagonals(){const e=[];let t=[];const i=()=>{t.length>=this.getAmountOfWinCells&&e.push(t),t=[]};for(let o=0;o<this.boardSize;o++){for(let s=0;s<this.boardSize;s++){const r=o+s;if(r>=this.boardSize)break;t.push(this.board[r][s])}i();for(let s=this.boardSize-1;s>=0;s--){const r=this.boardSize-1+o-s;if(r>=this.boardSize)break;t.push(this.board[r][s])}if(i(),o!==0){for(let s=0;s<this.boardSize;s++){const r=s-o;r<0||t.push(this.board[r][s])}i();for(let s=this.boardSize-1;s>=0;s--){const r=this.boardSize-1-o-s;r<0||t.push(this.board[r][s])}i()}}return e}get getAvailableMoves(){return this.board.reduce((e,t,i)=>(t.forEach((o,s)=>{o===""&&e.push({x:i,y:s})}),e),[])}get getAmountOfMadeMoves(){return this.board.reduce((e,t)=>(t.forEach(i=>e+=+(i!=="")),e),0)}get getIsAvoidChecking(){const e=this.boardSize===3?5:7;return this.getAmountOfMadeMoves<e}get getAmountOfWinCells(){return this.boardSize===3?3:4}}self.onmessage=a=>{const e=JSON.parse(a.data),i=new u(e.board,e.player).makeMove(e.level);self.postMessage(i)}})();
