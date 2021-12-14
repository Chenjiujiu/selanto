
	!function () {
		class sadhus_SnowFall{
			constructor(obj) {
				this.canvas=null;
				this.flakes=[];
				this.maxFlake=obj.maxFlake||500;
				this.ctx=null;
				this.flakeSize=obj.flakeSize||10;
				this.fallSpeed=obj.fallSpeed||1;
				this.imgSrc=obj.imgSrc||0;
			}
			start(){
				this.snowCanvas();
				this.createFlakes();
				this.drawSnow();
				this.event();
			}
			event(){
				window.addEventListener("resize",()=>{
					this.canvas.width=window.innerWidth;
				})
			}
			snowCanvas(){
				let snowCanvas = document.createElement("canvas");
				snowCanvas.id="snowfall";
				snowCanvas.width=window.innerWidth;
				snowCanvas.height=document.documentElement.offsetHeight;
				snowCanvas.setAttribute("style","position:absolute;top:0;left:0;z-index:100000;pointer-events:none;");
				document.querySelector("body").appendChild(snowCanvas);
				this.canvas=snowCanvas;
				this.ctx=snowCanvas.getContext("2d");
			}
			createFlakes(){
				let canvas=this.canvas;
				for (let i = 0; i < this.maxFlake; i++) {
					this.flakes.push(new sadhus_Flake(canvas,canvas.width,canvas.height,this.flakeSize,this.fallSpeed,this.imgSrc))
				}
			}
			drawSnow(){
				this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
				for (let i = 0; i < this.maxFlake; i++) {
					this.flakes[i].update();
					this.flakes[i].render(this.ctx);
				}
				let that=this;
				let req=this.requestAnimationFrame();
				req(function (){that.drawSnow()})
			}
			requestAnimationFrame(){
				return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function(callback) { setTimeout(callback, 1000 / 60); };
			}
		}
		class sadhus_Flake{
			constructor(canvas,maxWidth,maxHeight,flakeSize,fallSpeed,imgsrc) {
				this.maxWidth=maxWidth;
				this.maxHeight=maxHeight;
				this.flakeSize=flakeSize;
				this.fallSpeed=fallSpeed;
				this.canvas=canvas;
				this.imgsrc=imgsrc;
				this.stepSize=Math.random()/20;
				this.step=0;
				this.img='';
				this.init();
			}
			init(){
				this.x=Math.floor(Math.random()*this.canvas.width);
				this.y=Math.floor(Math.random()*this.canvas.height);
				this.size=Math.random()* this.flakeSize+2;
				this.speed=Math.random()+this.fallSpeed
				this.speedY=this.speed;
				this.speedX=0;
			}
			update(){
				this.speedX *=0.98;
				if(this.speedY<this.speed){
					this.speedY=this.speed;
				}
				this.speedX += Math.sin(this.step += .05) * this.stepSize ;
				this.x+=this.speedX;
				this.y+=this.speedY;
				if(this.x>=this.canvas.width || this.x<=0 ||this.y>=this.canvas.height||this.y<=0){
					this.reset()
				}
			}
			reset(width,height){
				this.init();
				this.y=0;
			}
			render(ctx){
				if(this.imgsrc){
					this.img=new Image();
					this.img.src=this.imgsrc;
					let snowFlake=ctx.drawImage(this.img,this.x,this.y,this.size,this.size);
				}else{
					let snowFlake=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size);
					snowFlake.addColorStop(0,"rgba(230,230,230,.9)");
					snowFlake.addColorStop(.5,"rgba(230,230,230,.5)");
					snowFlake.addColorStop(1,"rgba(230,230,230,0)");
					ctx.save()
					ctx.fillStyle=snowFlake;
					ctx.beginPath();
					ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
					ctx.fill();
					ctx.restore();
				}
			}
		}
		let snow = new sadhus_SnowFall({
			maxFlake: 100
	})
		snow.start();
	}()
