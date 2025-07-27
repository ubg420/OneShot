/*
 * constant
 */
var SCREEN_WIDTH   = 450;
var SCREEN_HEIGHT   = 800;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var FRICTION        = 0.96;
var TO_DIST         = SCREEN_WIDTH*0.86;
var STIR_DIST       = SCREEN_WIDTH*0.125;
var BLOW_DIST       = SCREEN_WIDTH*0.4;

var PLAYER;

var GameMain;

var RESULT = {
    main: { // MainScene用ラベル
        children: [{
            type: "Label",
            name: "Resultscore",
            fontSize: 90,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: SCREEN_HEIGHT /2 - 150,
            shadowColor:"white"
        },
        {
            type: "Label",
            name: "comment",
            fontSize: 23,
            fillStyle: "White",
            shadowBlur: 4,
            x: SCREEN_WIDTH /2,
            y: (SCREEN_HEIGHT /2 - 100) + 35,
        }],
    }
};

var ASSETS = {
    "title":  "./image/title.png",
    "Player":  "./image/Player.png",
    "Bullet":  "./image/Bullet.png",
    "Enemy":  "./image/Enemy.png",
    "EnemyGreenSS":  "./EnemyGreenSS.tmss",
    "EnemyGreen":  "./image/EnemyGreen.png",
    "EnemyBlueSS":  "./EnemyBlueSS.tmss",
    "EnemyBlue":  "./image/EnemyBlue.png",
    "EnemyRedSS":  "./EnemyRedSS.tmss",
    "EnemyRed":  "./image/EnemyRed.png",
    "EnemyGreen2SS":  "./EnemyGreen2SS.tmss",
    "EnemyGreen2":  "./image/EnemyGreen2.png",
    "EnemyBlue2SS":  "./EnemyBlue2SS.tmss",
    "EnemyBlue2":  "./image/EnemyBlue2.png",
    "EnemyRed2SS":  "./EnemyRed2SS.tmss",
    "EnemyRed2":  "./image/EnemyRed2.png",
};



var DEFAULT_PARAM = {
    width: 465,
    height: 465
};


//背景生成用
var backcontrol;

//画面全体をスクロールするためのY方向の速度
var worldvy;

var player;

var point;

var BackGroup;

var BulletGroup;
var EnemyGroup;
var EffectGroup;
var LiteGroup;
var ParticleGroup;
var ParticleGroupAll;
var ParticleGroup1;
var ParticleGroup2;
var ParticleGroup3;
var Title;

var StatusViewGroup;

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    app.background = "#000000"; 
    /*
    app.replaceScene( myLoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    }));
*/
    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });
    app.replaceScene(loading);


    //音楽
    //tm.sound.SoundManager.add("bound", "https://github.com/phi1618/tmlib.js/raw/0.1.0/resource/se/puu89.wav");
    
    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.Scene",
 
    init : function() {
        this.superInit({
            title :  "",
            width :  SCREEN_WIDTH,
            height : SCREEN_HEIGHT
        });
        Title = this;
/*
        this.title = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.title.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
*/
        //残機とか弾数とか描画

        EffectGroup = tm.app.CanvasElement().addChildTo(this); //     
        LiteGroup = tm.app.CanvasElement().addChildTo(this); //     
        BulletGroup = tm.app.CanvasElement().addChildTo(this); 
        EnemyGroup = tm.app.CanvasElement().addChildTo(this); 
        ParticleGroup = tm.app.CanvasElement().addChildTo(this); 


        var bar = light(SCREEN_WIDTH + 20,5,"hsla({0}, 100%, 100%, 1)".format("122")).addChildTo(this);
        bar.x = -10;
        bar.y = SCREEN_HEIGHT - 50;
        var BulletSp = tm.app.Sprite("Bullet", 5, 30).addChildTo(this);
        BulletSp.position.set(SCREEN_WIDTH - 100, SCREEN_HEIGHT - 20);
        this.ammoText = TextObject().addChildTo(this);
        this.ammoText.setPosition(SCREEN_WIDTH -50,SCREEN_HEIGHT - 20);
        this.ammoText.SetText("= " + "1");

        this.Tplayer =  TitlePlayer().addChildTo(this);
        this.Tenemy =  TitleEnemy().addChildTo(EnemyGroup);


        (50).times(function() {
            var c = Particle("hsla({0}, 80%, 50%, 1)".format(Math.rand(0, 360))).addChildTo(ParticleGroup);
            //画面外にパーティクル作って待機
            c.position.add(tm.geom.Vector2(-100, -100));
        });

        this.startflg = false;


        this.logo1 = TitleLogo1().addChildTo(EffectGroup);
        this.logo2 = TitleLogo2().addChildTo(EffectGroup);
        this.setumei = SetumeText().addChildTo(EffectGroup);

        // 画面(シーンの描画箇所)をタッチした時の動作
        this.addEventListener("pointingend", function(e) {
            if(this.SceneChange){
//                e.app.replaceScene(MainScene());
            }
        });


        this.timer = 0;

    },
    update: function(app) {
        if(this.startflg){
            if(this.timer == 0){        
                var gamestarttxt = GameStartText().addChildTo(EffectGroup);

            }

            if(this.timer == 60){

                pgc = ParticleGroup.children;
                pgc.each(function(par) {
                    if(par.AcctiveFLG){
                       par.remove();
                    }
                });

            }


            if(this.timer > 100){

                pgc = ParticleGroup.children;
                pgc.each(function(par) {
                    par.remove();
                });

            }




            if(this.timer > 130){
                app.replaceScene(MainScene());
           
            }
            else{
                this.timer++;
            }
        }
    },

    StatusViewDraw:function(){
        this.ammoText.SetText("= " + this.Tplayer.ammo);
    },


    Start: function(){
        this.startflg = true;
    },

    ShotStart: function(){
        this.logo1.remove();
        this.logo2.remove();
        this.setumei.remove();

    },
});

tm.define("TitlePlayer", {
    superClass: "tm.app.Sprite",

init: function() {
        this.superInit("Player");

        this.width = 55;
        this.height = 55;

        this.x = SCREEN_WIDTH / 2;
        this.y = SCREEN_HEIGHT - this.height - 30;


        this.light = light(50,26,"hsla({0}, 100%, 50%, 1)".format("176")).addChildTo(LiteGroup);
        this.light.x = this.x - 25;
        this.light.y = this.y + 2;

        this.ammo = 1;

        this.PlayFLG = true;
    },

    update: function(app) {
       
       if (app.pointing.getPointingStart() && this.PlayFLG) {
            if(this.ammo > 0){
                this.Shot();
            }
       }

    },

    Shot: function(){
        this.ammo--;
        var bullet = TitleBullet(this.y).addChildTo(BulletGroup);
        Title.StatusViewDraw();
        Title.ShotStart();
    },

    PlayStart: function(){
        this.PlayFLG = true;
    },

    PlayStop:function(){
        this.PlayFLG = false;
    },

});

//テキスト;
tm.define("TitleLogo1", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");


        this.x = (SCREEN_WIDTH / 2) -50;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;


        this.setFillStyle("white")
        this.setFontSize(60)  
        this.setShadowBlur(22)
        this.setShadowColor("white");


        this.text = "One";

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


    },

    SetText: function(txt){
        this.text = txt;
    },

});

tm.define("TitleLogo2", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");


        this.x = (SCREEN_WIDTH / 2) +50;
        this.y = 400;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;


        this.setFillStyle("white")
        this.setFontSize(60)  
        this.setShadowBlur(22)
        this.setShadowColor("white");



        this.text = "Shot";

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


    },

    SetText: function(txt){
        this.text = txt;
    },

});

tm.define("GameStartText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = (SCREEN_WIDTH / 2);
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;


        this.setFillStyle("white")
        this.setFontSize(55)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Game\nStart";

        this.tweener
            .clear()
            .to({scaleX:2,scaleY:2}, 1200,"easeOutBack")
            .wait(1500)
            .to({scaleX:0,scaleY:0}, 1200)

    },

    update: function(app) {


    },

    SetText: function(txt){
        this.text = txt;
    },

});

tm.define("SetumeText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = 600;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;


        this.setFillStyle("white")
        this.setFontSize(15)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "タッチでショット";

        this.tweener
            .clear()
            .to({scaleX:2,scaleY:2}, 500,"easeOutBack")
            .wait(1100)
            .to({scaleX:0,scaleY:0}, 500)
            .setLoop(true)


        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


    },

    SetText: function(txt){
        this.text = txt;
    },

});


tm.define("TitleBullet", {
    superClass: "tm.app.Sprite",

init: function(PlayerPosY) {
        this.superInit("Bullet");


        this.width = 6;
        this.height = 30;
        this.origin.x = 0;
        this.origin.y = 0;

        this.setShadowColor("white");
        this.setShadowBlur(22);

        this.x = SCREEN_WIDTH / 2;
        this.y = PlayerPosY - 50;

        this.vy = 30;
        this.SetCollision();

        this.HitFLG = false; //ダブった敵を同時に撃っちゃったとき用



    },

    update: function(app) {
        this.y -= this.vy;
        this.SetCollision();
        this.AtariHante();

        if(this.y < 0 - this.height ){
            this.MissBullet();


        }

    },


    SetCollision: function(){
        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y+ this.height;
    },

    //あたりはんてー
    AtariHante: function(){
        var ec = EnemyGroup.children;
        var self = this;
        
        ec.each(function(enemy) {
            if(clash(self,enemy) && !self.HitFLG){
                enemy.Hit();
                self.HitEnemy();
                self.HitFLG = true;
               }
        });
    },
    //敵を倒した時;
    HitEnemy: function(){
    
        this.remove();
    },

});


tm.define("TitleEnemy", {
    superClass: "tm.app.AnimationSprite",
    init: function (EnemySS) {
        this.superInit("EnemyGreenSS");
        this.gotoAndPlay("tati");

        //--初期値設定
        //ポジションとサイズ;
        this.width = 60;
        this.height = 60;
        this.x = SCREEN_WIDTH / 2 - 30;

        this.y = 100;
        this.origin.x = 0;
        this.origin.y = 0;
        this.position.set(this.x, this.y);


        //各プロパティ
        this.MoveState = "Entry";
        //this.EnemyMove = EnemyMoveState;　        //この敵が持つ動き
        this.Level;
        this.timer = 0;

        //ライト生成
        this.light = light(50,30,"hsla({0}, 100%, 50%, 1)".format("129")).addChildTo(LiteGroup);
        this.light.x = this.x;
        this.light.y = this.y;

        this.light2 = light(50,30,"hsla({0}, 100%, 50%, 1)".format("129")).addChildTo(LiteGroup);
        this.light2.x = this.x;
        this.light2.y = this.y;

        //コリジョン作成;
        this.SetCollision();


        var self = this;
        //パーティクル生成;

    },

    update: function(app) {

        this.MoveController();

        this.SetCollision();

        this.light.x = this.x + 4;
        this.light.y = this.y + 14;

        this.light2.x = this.x + 4;
        this.light2.y = this.y + 14;


    },


    MoveController: function(){

        switch (this.MoveState){
            case "Destroy":
                this.Destroy();
            break;
        }

    },


    SetCollision: function(){
        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y + 10;
        this.B = this.y+ this.height - 10;
    },

    Hit:function(){

        this.MoveState = "Destroy";

        this.timer = 0;

        self = this;
        var ec = ParticleGroup.children;
        var self = this;
        ec.each(function(par) {
            par.Go(self.x,self.y);
        });

        Title.Start();
        this.x = 999;

    },


    Destroy:function(){

        this.timer++;

        if(this.timer > 10){
            this.Delete();
        }

    },

    Delete:function(){
        this.light.remove();
        this.light2.remove();
        this.remove();
    }

});



//テキスト;
tm.define("Result", {
    superClass: "tm.app.Label",

init: function(STAGELEVEL) {
        this.superInit("");


        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;

        this.dir = 0;

        this.setFillStyle("white")
        this.setFontSize(40)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.ButtonWD = 140;
        this.ButtonHE = 40;
        this.MarginX  = (this.ButtonWD / 2) + 10;
        this.MarginY = 50;


        this.DeleteFLG = false;

        this.cachacom =  tm.ui.GlossyButton(this.ButtonWD , this.ButtonHE, "#32cd32", "かちゃコム").addChildTo(this);
        this.cachacom.setPosition(SCREEN_WIDTH - 100, SCREEN_HEIGHT -100);
        this.cachacom.onclick = function() {
            window.open("http://cachacacha.com");
        };

        this.resume =  tm.ui.GlossyButton(this.ButtonWD, this.ButtonHE, "", "もう一回").addChildTo(this);
        this.resume .setPosition(SCREEN_CENTER_X - this.MarginX, SCREEN_CENTER_Y + this.MarginY);

        this.DeleteFLG = false;
        self = this;
        this.resume .onclick = function() {
            self.DeleteFLG = true;

        };      

        this.ResultText = TextObject().addChildTo(this);
        this.ResultText.setPosition((SCREEN_WIDTH / 2),(SCREEN_HEIGHT / 2) - 100);
        this.ResultText.SetText("Stage" + STAGELEVEL);
        this.ResultText.setFontSize(60);

        this.ResultText2 = TextObject().addChildTo(this);
        this.ResultText2.setPosition((SCREEN_WIDTH / 2),(SCREEN_HEIGHT / 2) - 40);
        this.ResultText2.SetText("に到達した");
        this.ResultText2.setFontSize(30);




        this.tweet =  tm.ui.GlossyButton(this.ButtonWD, this.ButtonHE, "blue", "tweet").addChildTo(this);
        this.tweet.setPosition(SCREEN_CENTER_X + this.MarginX, SCREEN_CENTER_Y + this.MarginY);
        url = "cachacacha.com/GAME/OneShot/";
        txt = encodeURIComponent("Stage"+ STAGELEVEL + "に到達した" + url + "   #一発シューティングOneShot");
        this.tweet.onclick = function() {
            window.open("http://twitter.com/intent/tweet?text=" + txt);
        };

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


        if(this.DeleteFLG){

            if(this.timer == 0){

                RetryText().addChildTo(EffectGroup);
                GameMain.gameoverText.remove();
                this.Delete();    
               
            }
            if(this.timer == 80){

                GameMain.GameSetUp();
                this.remove();
            }

 

            this.timer++;

        }



    },

    SetText: function(txt){
        this.text = txt;
    },

    Delete: function(){

        this.cachacom.remove();
        this.tweet.remove();
        this.resume.remove();
        this.ResultText.remove();
        this.ResultText2.remove();
    }

});

tm.define("RetryText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH + 100;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;

        this.rotation = 30;

        this.setFillStyle("white")
        this.setFontSize(65)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Retry";

        this.tweener
            .clear()
            .to({x:this.x -300,scaleX:2,scaleY:2}, 500,"easeOutBack")
            .wait(1300)

        this.timer = 0;
        this.DestroyRemit = 50;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});  

tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();
        GameMain = this;

        BackGroup = tm.app.CanvasElement().addChildTo(this); //
        EffectGroup = tm.app.CanvasElement().addChildTo(this); //     
        LiteGroup = tm.app.CanvasElement().addChildTo(this); //     
        BulletGroup = tm.app.CanvasElement().addChildTo(this); 
        EnemyGroup = tm.app.CanvasElement().addChildTo(this); 
        ParticleGroup = tm.app.CanvasElement().addChildTo(this); 
        StatusViewGroup = tm.app.CanvasElement().addChildTo(this); 
        this.ZankiGroup = tm.app.CanvasElement().addChildTo(StatusViewGroup);
        ParticleGroupAll = tm.app.CanvasElement().addChildTo(this); 
        ParticleGroup1 = tm.app.CanvasElement().addChildTo(ParticleGroupAll);
        ParticleGroup2 = tm.app.CanvasElement().addChildTo(ParticleGroupAll);
        ParticleGroup3 = tm.app.CanvasElement().addChildTo(ParticleGroupAll);



        this.Player = Player().addChildTo(this);
        this.GameSetUp();


        //残機とか弾数とか描画
        var bar = light(SCREEN_WIDTH + 20,5,"hsla({0}, 100%, 100%, 1)".format("122")).addChildTo(StatusViewGroup);
        bar.x = -10;
        bar.y = SCREEN_HEIGHT - 50;
        var BulletSp = tm.app.Sprite("Bullet", 5, 30).addChildTo(StatusViewGroup);
        BulletSp.position.set(SCREEN_WIDTH - 100, SCREEN_HEIGHT - 20);
        this.ammoText = TextObject().addChildTo(StatusViewGroup);
        this.ammoText.setPosition(SCREEN_WIDTH -50,SCREEN_HEIGHT - 20);
        this.ammoText.SetText("= " +this.Player.ammo);
        this.ZankiText = TextObject().addChildTo(StatusViewGroup);
        this.ZankiText.setPosition(40,SCREEN_HEIGHT - 20);
        this.ZankiText.SetText((this.Zanki + 1));

        this.StatusViewDraw();

        this.EnemyPositionCenter = (SCREEN_WIDTH / 2) - (this.width / 2);
        this.EnemyPositionLeft = this.EnemyPositionCenter - 100;
        this.EnemyPositionRight = this.EnemyPositionCenter + 100;

        (40).times(function() {
            var c = Particle("hsla({0}, 80%, 50%, 1)".format(Math.rand(0, 360))).addChildTo(ParticleGroup1);
            //画面外にパーティクル作って待機
            c.position.add(tm.geom.Vector2(-100, -100));
        });


        (40).times(function() {
            var c = Particle("hsla({0}, 80%, 50%, 1)".format(Math.rand(0, 360))).addChildTo(ParticleGroup2);
            //画面外にパーティクル作って待機
            c.position.add(tm.geom.Vector2(-100, -100));
        });


        (40).times(function() {
            var c = Particle("hsla({0}, 80%, 50%, 1)".format(Math.rand(0, 360))).addChildTo(ParticleGroup3);
            //画面外にパーティクル作って待機
            c.position.add(tm.geom.Vector2(-100, -100));
        });




    },


    GameSetUp: function(){
        this.GameState = "Start";
        this.StageLevel = 1;
        this.NowShot = 1;
        this.Zanki = 2;
        this.EnemySpeed = 13;
        this.GameOverFlg = false;
        this.timer = 0;
    },



    update: function(app) {

        switch (this.GameState){

            case "Start":
                this.StageStart();
            break;

            case "Play":
                this.Play();
            break;

            case "Clear":
                this.Clear();
            break;

            case "GameOver":
                this.GameOver();
            break;

            case "Miss":
                this.Miss();
            break;

            case "ChangeShot":
                this.ChangeShot();
            break;

        }
    },

    StageStart: function(){

        if(this.timer == 0){        
              this.StageCreate();
              this.StatusViewDraw();
        //    enemy = Enemy("Ouhuku").addChildTo(EnemyGroup);

        }
        if(this.timer == 10){
            var stagetext = StageText(this.StageLevel).addChildTo(EffectGroup);
            var pgac = ParticleGroupAll.children;
            var self = this;
            pgac.each(function(pg) {
                pgc = pg.children;
                pgc.each(function(par) {
                    if(par.AcctiveFLG){
                       par.Exit(self.x,self.y);
                    }
                });
            });

        }


        if(this.timer == 40){
            var Readytext = ReadyText().addChildTo(EffectGroup);



        }

        if(this.timer > 77){

            this.Go();     
        }
        else{
            this.timer++;
        }

    },

    Go:function(){
        var gotext = GoText().addChildTo(EffectGroup);

        var ec = EnemyGroup.children;
        var self = this;
        ec.each(function(enemy) {
            enemy.Go();
        });

        this.Player.PlayStart();
        this.GameStateUpdate("Play");
        this.timer = 0;
    },

    Play: function(){
        this.timer = 0;
    },

    Clear: function(){

        if(this.timer == 0){        
            this.Player.PlayStop();
            var cleartext = ClearText().addChildTo(EffectGroup);
            this.StageLevel++;
        }
        if(this.timer > 63){
            this.GameStateUpdate("Start");
            this.timer = 0;

        }
        else{
            this.timer++;
        }

    },

    Miss: function(){

        if(this.timer == 0){        

            var misstext = MissText().addChildTo(EffectGroup);
            this.Zanki--;

            this.Player.PlayStop();
            var eg = EnemyGroup.children;
            eg.each(function(ec) {
                ec.MoveState = "Stop";
                ec.timer = 0;
            });

        }

        if(this.timer > 70){
            this.StatusViewDraw();
            if(this.Zanki < 0){

                this.GameStateUpdate("GameOver");
                this.timer = 0;
            }
            else{


                var pgac = ParticleGroupAll.children;
                var self = this;
                pgac.each(function(pg) {
                    pgc = pg.children;
                    pgc.each(function(par) {
                        if(par.AcctiveFLG){
                           par.Exit(self.x,self.y);
                        }
                    });
                });

                this.GameStateUpdate("Start");
                this.timer = 0;

            }

        }else{
            this.timer++;

        }


    },

    GameOver: function(){

        if(this.timer == 0){        
            this.gameoverText = GameOverText().addChildTo(EffectGroup);

        }

        if(this.timer == 80){        
            Result(this.StageLevel).addChildTo(this);
        }


        if(this.timer > 130){

        }
        else{
            this.timer++;
        }

    },

    EnemyDestroy: function(){
        var DestroyFLG = true;
        var self = this;

        var ec = EnemyGroup.children;
        ec.each(function(enemy) {
            if(enemy.MoveState != "Destroy"){   

                DestroyFLG = false;
            }

        });

        if(DestroyFLG){
            this.GameStateUpdate("Clear");
        }
    },

    GameStateUpdate:function(NextState){
        this.GameState = NextState;
    },

    StatusViewDraw:function(){

        var sbc = StatusViewGroup.children;

        var zankisp;
        var zankispPosX = 115;
        var zankispPosY = SCREEN_HEIGHT - 25;

        var zg = this.ZankiGroup.children;
        zg.each(function(zgc) {
            zgc.remove();
        });        

        for (var i = 0; i < this.Zanki; i++) {
            zankisp = tm.app.Sprite("Player", 55, 55).addChildTo(this.ZankiGroup);
            zankisp.position.set(zankispPosX, zankispPosY);
            zankispPosX  +=60
        }

        this.ammoText.SetText("= " +this.Player.ammo);

        this.ZankiText.SetText((this.Zanki + 1));
    },

    StageCreate:function(){
       switch(this.StageLevel){
       //switch(24){



            case 1:
               // enemy = Enemy("KaitenRakkaMove").addChildTo(EnemyGroup);
                this.EnemySpeed = 5;

                Enemy(this.EnemyPositionCenter,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                //var enemy6 = Enemy("KaitenRakka","EnemyRed2SS",Speed,"hsla({0}, 100%, 50%, 1)".format("0")).addChildTo(EnemyGroup);    

                this.Player.ammo  =1;

            break;

            case 2:
                this.EnemySpeed = 5;

                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);    
                this.Player.ammo  =1;

            break;

            case 3:
                this.EnemySpeed = 5;
                this.Player.ammo  =1;
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);    


            break;

            case 4:
                this.EnemySpeed = 6;
                this.Player.ammo  =1;
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);

            break;

            case 5:
                this.EnemySpeed = 6;
                this.Player.ammo  =1;
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);    


            break;

            case 6:
                this.EnemySpeed = 7;
                this.Player.ammo  =1;
                Enemy(this.EnemyPositionRight,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);    

            break;

            case 7:    
                this.GameState = "ChangeShot";

            break;

            case 8:
                this.EnemySpeed = 7;
                Enemy(this.EnemyPositionLeft,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);

                this.Player.ammo  =2;

            break;

            case 9:
                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionCenter,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);

                this.Player.ammo  =2;
            break;

            case 10:
                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionLeft,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionRight,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);    

                this.Player.ammo  =2;

            break;

            case 11:
                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionCenter,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);

                this.Player.ammo  =2;
            break;

            case 12:

                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionRight,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionLeft,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  

                this.Player.ammo  =2;

            break;

            case 13:

                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionLeft,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);

                this.Player.ammo  =2;

            break;

            case 14:
            
                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionRight,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);
                this.Player.ammo  =2;


            break;

            case 15:
            
                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionLeft,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  
                this.Player.ammo  =2;
            break;

            case 16:

                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionRight,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionLeft,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);     
                this.Player.ammo  =2;
            break;

            case 17:

                this.EnemySpeed = 8;
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);
                this.Player.ammo  =2;
            break;

            case 18:
                this.GameState = "ChangeShot";
            break;

            case 19:

                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionLeft,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;

            break;

            case 20:

                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionCenter,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionLeft,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);    
                this.Player.ammo  =3;

            break;

            case 21:

                this.EnemySpeed = 9;
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);     
                this.Player.ammo  =3;

            break;

             case 22:

                this.EnemySpeed = 10;
                Enemy(this.EnemyPositionLeft,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);     
                this.Player.ammo  =3;


            break;    

             case 23:

                this.EnemySpeed = 10;
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionLeft,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionRight,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup3).addChildTo(EnemyGroup);  
                this.Player.ammo  =3;

            break;    

             case 24:

                this.EnemySpeed = 11;
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);    
                this.Player.ammo  =3;


            break;    

             case 25:

                this.EnemySpeed = 11;
                Enemy(this.EnemyPositionLeft,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"Ouhuku","EnemyGreenSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;


            break;    

             case 26:

                this.EnemySpeed = 11;
                Enemy(this.EnemyPositionLeft,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;


            break;  

            case 27:

                this.EnemySpeed = 10;
                Enemy(this.EnemyPositionLeft,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionRight,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;

            break;  

            case 28:

                this.EnemySpeed = 10;
                Enemy(this.EnemyPositionLeft,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaiten","EnemyRedSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);    
                Enemy(this.EnemyPositionRight,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;

            break;  


            case 29:

                this.EnemySpeed = 20;
                Enemy(this.EnemyPositionLeft,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"OuhukuRakka","EnemyBlueSS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;

            break;  

            case 30:

                this.EnemySpeed = 11;
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  
                this.Player.ammo  =3;

            break;  

            case 31:
                this.EnemySpeed = 13;
                Enemy(this.EnemyPositionLeft,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionRight,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);     
                this.Player.ammo  =3;


            break;  

            case 32:

                this.EnemySpeed = 13;
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup1).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup2).addChildTo(EnemyGroup);     
                Enemy(this.EnemyPositionCenter,"KaitenRakka","EnemyRed2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("0"),ParticleGroup3).addChildTo(EnemyGroup);     
                this.Player.ammo  =3;

            break;  

            case 33:

                this.EnemySpeed = 13;
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup1).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup2).addChildTo(EnemyGroup);  
                Enemy(this.EnemyPositionCenter,"KaminariRakka","EnemyBlue2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("237"),ParticleGroup3).addChildTo(EnemyGroup);  
                this.Player.ammo  =3;

            break;  

            case 34:

                this.EnemySpeed = 13;
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup1).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup2).addChildTo(EnemyGroup);
                Enemy(this.EnemyPositionCenter,"Kaminari","EnemyGreen2SS",this.EnemySpeed,"hsla({0}, 100%, 50%, 1)".format("129"),ParticleGroup3).addChildTo(EnemyGroup);
                this.Player.ammo  =3;

            break;  

        }

        if(this.StageLevel > 34){
            var position;
            var movepattern
            var spritess;
            var enemycolor;

            for (var i = 0; i < 3; i++) {

                movepattern = "Ouhuku";
                spritess = "EnemyGreenSS";
                enemycolor = "hsla({0}, 100%, 50%, 1)".format("129");
                position = this.EnemyPositionCenter;


                switch(rand(3)){
                    case 0:
                        position = this.EnemyPositionCenter;
                    break;
                    case 1:
                        position = this.EnemyPositionRight;
                    break; 
                    case 2:
                        position = this.EnemyPositionLeft;
                    break; 

                }

                switch(rand(6)){
                    case 0:
                        movepattern = "Ouhuku";
                        spritess = "EnemyGreenSS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("129");
                    break;
                    case 1:                       
                        movepattern = "OuhukuRakka";
                        spritess = "EnemyBlueSS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("237");

                    break; 
                    case 2:
                        movepattern = "Kaiten";
                        spritess = "EnemyRedSS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("0");
                    break; 
                    case 3:
                        movepattern = "Kaminari";
                        spritess = "EnemyGreen2SS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("129");                       
                    break;
                    case 4:
                        movepattern = "KaminariRakka";
                        spritess = "EnemyBlue2SS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("237");
                    break; 
                    case 5:
                        movepattern = "KaitenRakka";
                        spritess = "EnemyRed2SS";
                        enemycolor = "hsla({0}, 100%, 50%, 1)".format("0");                       
                    break; 

                }

                switch(i){
                    case 0:
                        Enemy(position,movepattern,spritess,this.EnemySpeed,enemycolor,ParticleGroup1).addChildTo(EnemyGroup);
                    break;
                    case 1:
                        Enemy(position,movepattern,spritess,this.EnemySpeed,enemycolor,ParticleGroup2).addChildTo(EnemyGroup);
                    break; 
                    case 2:
                        Enemy(position,movepattern,spritess,this.EnemySpeed,enemycolor,ParticleGroup3).addChildTo(EnemyGroup);
                    break; 
                }

            }
            this.Player.ammo  =3;
            this.EnemySpeed += 0.2;
        }

    },


    ChangeShot:function(){
        if(this.timer == 1){        
            switch(this.NowShot){
                case 1:
                    this.nowshottext = "One";
                    this.nextshottext = "Two";
                break;
                case 2:
                    this.nowshottext = "Two";
                    this.nextshottext = "Three";
                break;
            }

            NowShotText(this.nowshottext).addChildTo(EffectGroup);
            ShotText().addChildTo(EffectGroup);
        }
        if(this.timer == 100){      

            PekeText().addChildTo(EffectGroup);
        }
        if(this.timer == 150){        
            NextShotText(this.nextshottext).addChildTo(EffectGroup);
        }

        if(this.timer > 220){
            this.timer = 0;
            this.StageLevel++;
            this.GameState = "Start";
            this.NowShot++;


        }
        else{
            this.timer++;
        }

    },
});


tm.define("Enemy", {
    superClass: "tm.app.AnimationSprite",
    init: function (x,EnemyMoveState,EnemySS,Speed,Color,MyParticleGroup) {
        this.superInit(EnemySS);
        this.gotoAndPlay("tati");

        //--初期値設定
        //ポジションとサイズ;
        this.width = 60;
        this.height = 60;
        this.x = x;

        this.y = -(this.height + 30);
        this.origin.x = 0;
        this.origin.y = 0;
        this.position.set(this.x, this.y);

        //運動量
        this.vx = Speed;

        if(EnemyMoveState == "Kaminari"){
            this.vy = Speed * 2;
            this.vx = Speed - (Speed / 10);
        }
        if(EnemyMoveState == "KaminariRakka"){
            this.vy = Speed / 2.5;
        }

        this.speed = Speed;

        //円運動用
        this.centerX = 1;
        this.centerY = 1;
        this.r = 1.2;
        this.pi = Math.PI;
        this.sita = 0;
        this.COS,
        this.SIN;
        this.imgX = 0;
        this.imgY = 0;

        //各プロパティ
        this.MoveState = "Entry";
        this.EnemyMove = EnemyMoveState;　        //この敵が持つ動き
        this.Level;
        this.timer = 0;

        //ライト生成
        this.light = light(50,30,Color).addChildTo(LiteGroup);
        this.light.x = this.x;
        this.light.y = this.y;

        this.light2 = light(50,30,Color).addChildTo(LiteGroup);
        this.light2.x = this.x;
        this.light2.y = this.y;

        //コリジョン作成;
        this.SetCollision();

        this.EnemyParticleGroup = MyParticleGroup;
        var self = this;
        //パーティクル生成;

    },

    update: function(app) {


        this.MoveController();

        this.SetCollision();

        this.light.x = this.x + 4;
        this.light.y = this.y + 14;

        this.light2.x = this.x + 4;
        this.light2.y = this.y + 14;

        this.PositionCheck();



    },


    MoveController: function(){

        switch (this.MoveState){

            case "Entry":
                this.EntryMove();
            break;

            case "Ouhuku":
                this.OuhukuMove();
            break;

            case "OuhukuRakka":
                this.OuhukuRakkaMove();
            break;

            case "Kaminari":
                this.KaminariMove();
            break;

            case "KaminariRakka":
                this.KaminariRakkaMove();
            break;

            case "Kaiten":
                this.KaitenMove();
            break;

            case "KaitenRakka":
                this.KaitenRakkaMove();
            break;

            case "Stop":
                this.Stop();
            break;

            case "Destroy":
                this.Destroy();
            break;
        }

    },

    EntryMove: function(){
        if(this.y <= this.height + 50){
            this.y += 3;

        }

    },

    OuhukuMove: function(){
        this.x += this.vx;

        if(this.x > SCREEN_WIDTH - this.width || this.x < 0){
            this.vx *= -1;
          //  this.y += (this.height - 10);
        }
    },

    OuhukuRakkaMove: function(){
        this.x += this.vx;

        if(this.x > SCREEN_WIDTH - this.width || this.x < 0){
            this.y += this.height;
            this.vx *= -1;
          //  this.y += (this.height - 10);
        }
    },

    KaminariMove: function(){

        this.x += this.vx;
        this.y += this.vy;
        if(this.x > SCREEN_WIDTH - this.width || this.x < 0){
            this.vx *= -1;
          //  this.y += (this.height - 10);
        }
        if(this.y > 180 || this.y < 0){
            this.vy *= -1;
          //  this.y += (this.height - 10);
        }
    },

    KaminariRakkaMove: function(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x > SCREEN_WIDTH - this.width || this.x < 0){
            this.vx *= -1;
          //  this.y += (this.height - 10);
        }
    },

    KaitenMove: function(){

        if(this.timer == 0){
            this.Kaitenspeed  = this.speed / 100;
            this.CircleSize = 100;

            this.CircleCenter_x = this.x;
            this.CircleCenter_y = this.CircleSize  + this.y;
        }

        this.timer++;

        this.x = Math.sin(this.timer * this.Kaitenspeed) * this.CircleSize + this.CircleCenter_x;
        this.y = -Math.cos(this.timer * this.Kaitenspeed) * this.CircleSize + this.CircleCenter_y;

    },

    KaitenRakkaMove: function(){

        if(this.timer == 0){
            this.Kaitenspeed  = this.speed / 100;
            this.CircleSize = 100;

            this.CircleCenter_x = this.x;
            this.CircleCenter_y = this.CircleSize  + this.y;
        }

        this.timer++;
        this.CircleCenter_y += (this.speed / 10) + 1;

        this.x = Math.sin(this.timer * this.Kaitenspeed) * this.CircleSize + this.CircleCenter_x;
        this.y = -Math.cos(this.timer * this.Kaitenspeed) * this.CircleSize + this.CircleCenter_y;

    },

    SetCollision: function(){
        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y + 10;
        this.B = this.y+ this.height - 10;
    },

    Hit:function(){

        this.gotoAndPlay("Destroy");
        this.MoveState = "Destroy";
        GameMain.EnemyDestroy();

        this.timer = 0;

        self = this;

        var ec = this.EnemyParticleGroup.children;
        var self = this;
        ec.each(function(par) {
            par.Go(self.x,self.y);
        });

        this.x = 999;

    },

    Go:function(){
        this.MoveState = this.EnemyMove;
        this.timer = 0;
    },

    Stop:function(){
        this.timer++;

        if(this.timer > 65){
            this.Delete();
        }
    },

    PositionCheck:function(){
        if(this.y + this.height > SCREEN_HEIGHT - 40 && this.MoveState != "Stop"){
            GameMain.GameStateUpdate("Miss");
        }


    },

    Destroy:function(){

        this.timer++;

        if(this.timer > 10){
            this.Delete();
        }

    },

    Delete:function(){
        this.light.remove();
        this.light2.remove();
        this.remove();
    }

});


tm.define("Player", {
    superClass: "tm.app.Sprite",

init: function() {
        this.superInit("Player");

        this.width = 55;
        this.height = 55;

        this.x = SCREEN_WIDTH / 2;
        this.y = SCREEN_HEIGHT - this.height - 30;


        this.light = light(50,26,"hsla({0}, 100%, 50%, 1)".format("176")).addChildTo(LiteGroup);
        this.light.x = this.x - 25;
        this.light.y = this.y + 2;

        this.ammo = 0;

        this.PlayFLG = false;
    },

    update: function(app) {
       
       if (app.pointing.getPointingStart() && this.PlayFLG) {
            if(this.ammo > 0){
                this.Shot();
            }
       }

    },

    Shot: function(){
        this.ammo--;

        var FinalBulletFLG = false;
        if(this.ammo <1){
            FinalBulletFLG = true;
        }
        var bullet = Bullet(FinalBulletFLG,this.y).addChildTo(BulletGroup);
        GameMain.StatusViewDraw();
    },

    PlayStart: function(){
        this.PlayFLG = true;
    },

    PlayStop:function(){
        this.PlayFLG = false;
    },

});

tm.define("Bullet", {
    superClass: "tm.app.Sprite",

init: function(finalbulletflg,PlayerPosY) {
        this.superInit("Bullet");

        this.finalbulletflg = finalbulletflg; //最後の一発かどうか;

        this.width = 6;
        this.height = 30;
        this.origin.x = 0;
        this.origin.y = 0;

        this.setShadowColor("white");
        this.setShadowBlur(22);

        this.x = SCREEN_WIDTH / 2;
        this.y = PlayerPosY - 50;



        this.vy = 30;
        this.SetCollision();

        this.HitFLG = false; //ダブった敵を同時に撃っちゃったとき用

    },

    update: function(app) {
        this.y -= this.vy;
        this.SetCollision();
        this.AtariHante();

        if(this.y < 0 - this.height ){
            this.MissBullet();


        }

    },


    SetCollision: function(){
        this.L = this.x;
        this.R = this.x + this.width;
        this.T = this.y;
        this.B = this.y+ this.height;
    },

    //あたりはんてー
    AtariHante: function(){
        var ec = EnemyGroup.children;
        var self = this;
        
        ec.each(function(enemy) {
            if(clash(self,enemy) && !self.HitFLG){
                enemy.Hit();
                self.HitEnemy();
                self.HitFLG = true;
               }
        });
    },

    //敵を倒した時;
    HitEnemy: function(){
        
/*
        if(this.finalbulletflg){
            var ec = EnemyGroup.children;
            var self = this;
            var enemyFLG = false;

            ec.each(function(enemy) {
                if(enemy.MoveState != "Destroy"){  
                    enemyFLG = true;
                }

            });

            if(enemyFLG){
                GameMain.GameStateUpdate("Miss");
            }
        }
*/
        this.remove();
    },


    //命中しなかった時
    MissBullet: function(){
        
        GameMain.GameStateUpdate("Miss");
        this.remove();
    },




});

//テキスト;
tm.define("TextObject", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");


        this.x = 120;
        this.y = 200;
        this.vx = 0;
        this.vy = 0;

        this.dir = 0;

        this.setFillStyle("white")
        this.setFontSize(40)  
        this.setShadowBlur(22)
        this.setShadowColor("white");


        this.text = "test";

        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {


    },

    SetText: function(txt){
        this.text = txt;

    },

});

tm.define("StageText", {
    superClass: "tm.app.Label",

init: function(stage) {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = 380;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;

        this.Muki = 1;

        this.setFillStyle("white")
        this.setFontSize(45)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Stage " + stage;

        this.tweener
            .clear()
            .to({scaleX:2,scaleY:2}, 400,"easeOutBack")
            .wait(1670)
            .to({scaleX:0,scaleY:0}, 400)



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});    

tm.define("ReadyText", {
    superClass: "tm.app.Label",

init: function(stage) {
        this.superInit("");

        this.x = -300;
        this.y = 210;
        this.vx = 0;
        this.vy = 0;

        this.Muki = 1;

        this.setPosition(this.x, this.y)
        this.setFillStyle("white")
        this.setFontSize(50)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Ready";

        this.tweener
            .clear()
            .to({x: this.x + (400 * this.Muki)}, 300)
            .to({x: this.x + (430 * this.Muki)}, 850)
            .to({x: this.x + (1200 * this.Muki)}, 400 )



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});    

tm.define("GoText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH + 50;
        this.y = 500;
        this.vx = 0;
        this.vy = 0;

        this.Muki = 1;

        this.setPosition(this.x, this.y)
        this.setFillStyle("white")
        this.setFontSize(85)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Go!";

        this.tweener
            .clear()
            .to({x: this.x - 150}, 100)
            .to({x: this.x - 190}, 850)
            .to({x: this.x - 1400}, 400 )



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});       

tm.define("ClearText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;


        this.setFillStyle("white")
        this.setFontSize(65)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Clear!";

        this.tweener
            .clear()
            .to({scaleX:2,scaleY:2}, 500,"easeOutBack")
            .wait(1100)
            .to({scaleX:0,scaleY:0}, 500)



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});        


tm.define("MissText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = -100;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 0;
        this.scaleY = 0;

        this.rotation = 30;

        this.setFillStyle("white")
        this.setFontSize(65)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Miss!";

        this.tweener
            .clear()
            .to({y:this.y + 400,scaleX:2,scaleY:2}, 500,"easeOutBack")
            .wait(1300)
            .to({scaleX:0,scaleY:0}, 500)



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});     



tm.define("GameOverText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = SCREEN_WIDTH / 2;
        this.y = -100;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;


        this.setFillStyle("white")
        this.setFontSize(40)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "GameOver";

        this.tweener
            .clear()
            .to({y:this.y + 300}, 1500)
            .wait(1300)
  //          .to({scaleX:0,scaleY:0}, 1500)



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {
/*
        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }
*/
    },

});     

tm.define("NowShotText", {
    superClass: "tm.app.Label",

init: function(nowshot) {
        this.superInit("");

        this.x = (SCREEN_WIDTH / 2) -50;
        this.y = - 200;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;


        this.setFillStyle("white")
        this.setFontSize(60)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = nowshot;

        this.tweener
            .clear()
            .to({y:this.y + 500}, 2000)
            .wait(2800)
            .to({x: this.x - 500},100)



        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});     

tm.define("NextShotText", {
    superClass: "tm.app.Label",

init: function(nextshot) {
        this.superInit("");

        this.x = SCREEN_WIDTH;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;



        this.setFillStyle("white")
        this.setFontSize(60)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = nextshot;

        this.tweener
            .clear()
            .to({x:this.x - 275}, 500,"easeOutBack")
            .wait(800)
            .to({scaleX:2.5,scaleY:2.5}, 200,"easeOutBack")




        this.timer = 0;
        this.DestroyRemit = 50;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});     

tm.define("ShotText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = (SCREEN_WIDTH / 2) +50;
        this.y = -100;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 2;
        this.scaleY = 2;

        this.setFillStyle("white")
        this.setFontSize(60)  
        this.setShadowBlur(22)
        this.setShadowColor("white");

        this.text = "Shot";

        this.tweener
            .clear()
            .to({y:this.y + 500}, 2000)
            .wait(4250)
            .to({scaleX:2.5,scaleY:2.5}, 200,"easeOutBack")


        this.timer = 0;
        this.DestroyRemit = 200;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});     

tm.define("PekeText", {
    superClass: "tm.app.Label",

init: function() {
        this.superInit("");

        this.x = (SCREEN_WIDTH / 2) - 50;
        this.y = -100;
        this.vx = 0;
        this.vy = 0;
        this.scaleX = 3;
        this.scaleY = 3;

        this.rotation = 30;

        this.setFillStyle("red")
        this.setFontSize(65)  
        this.setShadowBlur(22)
        this.setShadowColor("red");

        this.text = "×";

        this.tweener
            .clear()
            .to({y:this.y + 400}, 500,"easeOutBack")
            .wait(1000)
            .to({x: this.x - 500},100)



        this.timer = 0;
        this.DestroyRemit = 100;

    },

    update: function(app) {

        this.timer++;
        if(this.timer > this.DestroyRemit){
            this.remove();
        }

    },

});  




//ライト----------------------------------------------------------------
tm.define("light", {
    superClass: "tm.app.CanvasElement",

    
    init: function(width,height,color) {
        this.superInit();
        this.x = 100;
        this.y = 150;
        this.color = color;
        this.width = width;
        this.height = height;

        this.setShadowBlur(45);
        this.setShadowColor(color);
      //  this.setShadowColor("white");
        this.vx = 0;
        this.vy = 0;




        //this.v = tm.geom.Vector2(0, 0);
    },
    
    update: function(app) {

        this.x += this.vx;
        this.y += this.vy;



    },
    
    draw: function(c) {
    c.globalCompositeOperation = "lighter";
    c.fillStyle = this.color;
    //c.fillRoundRect(0, 0, 50, 30, 10);
    c.fillRoundRect(0, 0, this.width, this.height, 10);
    }



});


tm.define("Particle", {
    superClass: tm.app.Shape,
    
    init: function(color) {
        this.superInit(10, 10);
        
        this.v = tm.geom.Vector2(0, 0);
        this.fillStyle = color;
        this.blendMode = "lighter";
        this.canvas.setTransformCenter();
        this.canvas.fillStyle = color;
        this.canvas.fillStar(0, 0, 5, 5);

        this.vp = tm.geom.Vector2(0, 0);

        this.AcctiveFLG = false;
        this.ExitFLG = false;


        this.vx = 0;
        this.vy = 0;

    },
    
    update: function(app) {

        if(this.AcctiveFLG){
            var p  = app.pointing;
            var dv = tm.geom.Vector2.sub(this, this.vp);
            var d  = dv.length() || 0.001;
            dv.div(d);  // normalize
            
            // タッチによる反発
            if (d < BLOW_DIST) {
                var blowAcc = (1 - (d/BLOW_DIST)) * 14;
                this.v.x += dv.x * blowAcc + 0.5 - Math.random();
                this.v.y += dv.y * blowAcc + 0.5 - Math.random();
            }
          
            if (d<STIR_DIST) {
                var mAcc = ( 1 - (d / STIR_DIST) * app.width * 0.00026 );
                this.v.x += mAcc * 0.1;
                this.v.y += mAcc * 0.1;
            }
     
            // 摩擦
            this.v.mul(FRICTION);
            // 移動
            this.position.add(this.v);
            
            // ハミ出しチェック

            if(!this.ExitFLG){
                if (this.x > app.width) {
                    this.x = app.width; this.v.x *= -1;
                }
                else if (this.x < 0) {
                    this.x = 0; this.v.x *= -1;
                }
                if (this.y > app.height) {
                    this.y = app.height; this.v.y *= -1;
                }
                else if (this.y < 0) {
                    this.y = 0; this.v.y *= -1;
                }
            }
            else{

                if(this.y > SCREEN_HEIGHT){
                    //this.remove();
                    this.x = -100;
                    this.y = -100;
                    this.vx = 0;
                    this.vy = 0;
                    this.vp = tm.geom.Vector2(0, 0);
                    this.v = tm.geom.Vector2(0, 0);

                    this.AcctiveFLG = false;
                    this.ExitFLG = false;
                }
            }

            // スケール
            var scale = this.v.lengthSquared() * 0.02;
            scale = Math.clamp(scale, 1, 3);
            this.scaleX = this.scaleY = scale;

            // 回転
            this.rotation += scale*8;


            this.v.x += this.vx;
            this.v.y += this.vy;

/*
        if (p.getPointing()) {

            this.vy = 2;
            this.ExitFLG = true;
        }
*/


        }


    },

    Go: function(x,y) {

        this.x = x;
        this.y = y;
        this.vp = tm.geom.Vector2(x, y);

        this.AcctiveFLG = true;

    },

    Exit: function(x,y) {
        this.vy = 1.5;
        this.ExitFLG = true;
    }


    
});

//衝突判定
function clash(a,b){
    if((a.L <= b.R) && (a.R >= b.L) 
    && (a.T  <= b.B) && (a.B >= b.T))
    {
            return true
    }
    return false;
}

function rand(n){
    return Math.floor(Math.random() * (n + 1));
}
