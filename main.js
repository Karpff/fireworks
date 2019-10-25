var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = innerWidth;
canvas.height = innerHeight;
var c = canvas.getContext('2d');
c.fillRect(0,0,canvas.width,canvas.height);

var g = 0.1;
var f = 0;
var ids = 0;

var settings =
{
  high:
  {
    fireworkInterval: 20,
    particlesBase: 110,
    particlesRare: 30,
    particlesSubRare: 20,
  },
  medium:
  {
    fireworkInterval: 40,
    particlesBase: 80,
    particlesRare: 20,
    particlesSubRare: 15,
  },
  low:
  {
    fireworkInterval: 60,
    particlesBase: 50,
    particlesRare: 10,
    particlesSubRare: 10,
  }
};

var set = settings.medium;
var rare = true;
var trail = 0.25;
var audio = false;

function changeSettings(x)
{
  if(x)
  {
    set = settings[x];
    document.getElementById("high").style.textDecoration = "none";
    document.getElementById("medium").style.textDecoration = "none";
    document.getElementById("low").style.textDecoration = "none";
    document.getElementById(x).style.textDecoration = "underline";
  }
  rare = document.getElementById("rare").checked;
  audio = document.getElementById("audio").checked;
  if(document.getElementById("trail").checked){trail = 0.25;}else{trail = 1;}
}

class Firework
{
  constructor(id,x,y,angle,force,color,timer,width,exX,exY)
  {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.force = force;
    this.spdX = Math.cos(this.angle/180*Math.PI)*this.force;
    this.spdY = Math.sin(this.angle/180*Math.PI)*this.force;
    this.color = color;
    this.timer = timer;
    this.width = width;
    this.dead = false;
    if(this.width <= 6)
    {
      this.spdY -= 2;
      this.spdY += exY/5;
      this.spdX += exX/5;
    }
    if(rare && Math.random()<0.03 && this.width == 8)
    {
      this.rare = true;
      this.width = 12;
    }
    else this.rare = false;
  }

  update()
  {
    if(!this.dead)
    {
      if(this.rare)this.color+=10;
      c.beginPath();
      c.arc(this.x,this.y,this.width/2,0,Math.PI*2);
      c.fillStyle = "hsl("+this.color+",100%,50%)";
      c.fill();
      c.strokeStyle = "hsl("+this.color+",100%,50%)";
      c.beginPath();
      c.moveTo(this.x,this.y);
      this.spdY += g;
      this.x += this.spdX;
      this.y += this.spdY;
      c.lineTo(this.x,this.y);
      c.lineWidth = this.width;
      c.stroke();
      c.beginPath();
      c.arc(this.x,this.y,this.width/2,0,Math.PI*2);
      c.fillStyle = "hsl("+this.color+",100%,50%)";
      c.fill();
      this.timer--;
      if(this.width <= 0.1){this.width = 0; this.dead = true;}
      else if(this.width <= 4){this.width-=0.05;}
      if(this.y>innerHeight)
      {
        this.dead = true;
      }
      if(this.timer==0)
      {
        booms.push(new Boom(booms.length,this.x,this.y,this.color));
        if(this.rare)
        {
          this.n = set.particlesRare;
          for(let i=0;i<this.n;i++)
          {
            fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,Math.random()*360,parseInt(Math.random()*15+40),this.width/2,this.spdX,this.spdY));
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.play();
          }
        }
        else if(this.width == 6)
        {
          this.n = set.particlesSubRare;
          for(let i=0;i<this.n;i++)
          {
            fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,this.color,-1,this.width/2,this.spdX,this.spdY));
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.volume = 0.05;
            sfx.play();
          }
        }
        else
        {
          this.n = set.particlesBase;
          if(Math.random()<0.2)
          {
            for(let i=0;i<this.n;i++)
            {
              fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*0.5+2.5,this.color,-1,this.width/2,this.spdX,this.spdY));
            }
          }
          else
          {
            for(let i=0;i<this.n;i++)
            {
              fireworks.push(new Firework(fireworks.length,this.x,this.y,Math.random()*360,Math.random()*3,this.color,-1,this.width/2,this.spdX,this.spdY));
            }
          }
          if(audio)
          {
            var sfx = document.createElement("AUDIO");
            sfx.innerHTML = '<source src="boom.mp3" type="audio/mp3">';
            sfx.volume = 0.3;
            sfx.play();
          }
        }
        this.timer--;
        this.dead = true;
      }
    }
  }
}

class Boom
{
  constructor(id,x,y,color)
  {
    this.x = x;
    this.y = y;
    this.color = color;
    this.a = 30; //alpha
    this.r = 0; //radius
  }

  update()
  {
    this.r+=10;
    this.a-=2;
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,Math.PI*2);
    c.fillStyle = "hsl("+this.color+",100%,"+this.a+"%)";
    c.fill();
    if(this.a<0){booms.splice(this.id,1,);}
  }
}

var fireworks = [];
var booms = [];

function animate()
{
  c.fillStyle = "rgba(0,0,0,"+trail+")";
  c.fillRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<booms.length;i++)
  {
    booms[i].update();
  }
  if(f%set.fireworkInterval==0)
  {
    fireworks.push(new Firework(fireworks.length,Math.random()*innerWidth,innerHeight,Math.random()*40+250,Math.random()*5+9,Math.random()*360,parseInt(Math.random()*80)+40,8,0,0));
  }
  f++;
  for(let i=0;i<fireworks.length;i++)
  {
    fireworks[i].update();
  }
  window.requestAnimationFrame(animate);
}
animate();
