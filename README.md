### ツクールMVでフレームを跨いだ処理を同期処理っぽく書くためのプラグイン

***

RPGツクールMVでフレームを跨いだ処理をしたい場合ってけっこうありますよね？
特にアクションゲームを作る場合なんかだと、攻撃グラフィックを表示したnフレーム後に当たり判定を行い……のような処理をしたい場合は多々あるかと思います。
MV側のイベントで実装する場合は処理の間にウェイト挟むだけですが、スクリプトで同様のことをやろうとするとそういう訳にも行きません。
ツクール側のスクリプトでフレームに同期した処理を簡単に書く手段が提供されていないっぽいので、なければ作ってしまおうと言うことでプラグインを作りました。

***

つかいかた

```
var tasks = new FrameTaskList();

// FrameTaskList#addTask() で1フレーム分の処理を追加
tasks.addTask(function(){
	console.log("一秒後に叫びます");
}.bind(this));

// FrameTaskList#addWait() でウェイト追加
tasks.addWait(60);

// FrameTaskList#addTask() で1フレーム分の処理を追加
tasks.addTask(function(){
	console.log("あああああああああああああ");
}.bind(this));

FrameTaskExecuter.execTask(tasks);

```

FrameTaskListにフレームごとの処理を順番に詰め込んでいき、FrameTaskExecuterに渡すことによって処理が実行されます。

```
var tasks = new FrameTaskList();

tasks.addTask(function(){
	console.log("一秒後に叫びます");
}.bind(this))
.addWait(60)				// 60フレームほどウエイト
.addTask(function(){
	console.log("あああああああああああああ");
}.bind(this));

FrameTaskExecuter.execTask(tasks);

```

メソッドチェーンを使って書くこともできます。（というかこちらが基本の使い方になると思います）

***

