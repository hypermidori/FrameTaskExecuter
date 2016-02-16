### ツクールMVでフレームを跨いだ処理を同期処理っぽく書くためのプラグイン

***

RPGツクールMVでフレームを跨いだ処理をしたい場合ってけっこうありますよね？  
特にアクションゲームを作る場合なんかだと、攻撃グラフィックを表示したnフレーム後に当たり判定を行い……のような処理をしたい場合は多々あるかと思います。  
MV側のイベントで実装する場合は処理の間にウェイト挟むだけですが、スクリプトで同様のことをやろうとするとそういう訳にも行きません。  
MV側のスクリプトではフレームに同期した処理を簡単に書く手段が提供されていないようなので、なければ作ってしまおうとプラグインを作りました。  
メソッドチェーンを使えば同期処理っぽく書けるようになっています。

***

### つかいかた

***

```
var tasks = new FrameTaskList();

// FrameTaskList#addTask() で1フレーム分のタスクを追加
tasks.addTask(function(){
	console.log("一秒後に叫びます");
}.bind(this));

// FrameTaskList#addWait() でウェイト追加
tasks.addWait(60);

// FrameTaskList#addTask() で1フレーム分のタスクを追加
tasks.addTask(function(){
	console.log("あああああああああああああ");
}.bind(this));

FrameTaskExecuter.execTask(tasks);

```

FrameTaskListにフレームごとのタスクを順番に詰め込んでゆき、FrameTaskExecuterに渡すことによって処理が実行されます。  

```
var tasks = new FrameTaskList();

tasks.addTask(function(){
	console.log("一秒後に叫びます");
}.bind(this))
.addWait(60)
.addTask(function(){
	console.log("あああああああああああああ");
}.bind(this));

FrameTaskExecuter.execTask(tasks);

```

メソッドチェーンを使って書くこともできます。（こちらが基本の使い方になると思います）  

```
// FrameTaskList#interrupt() で中断
tasks.interrupt();
```

実行中のタスクをFrameTaskList#interrupt() で中断できます。  

```
// FrameTaskList#addCompleteListener() で完了時の処理リスナ追加
tasks.addCompleteListener(function(){
	console.log("完了時処理");
}.bind(this));

// FrameTaskList#addInterruptListener() でタスク中断時の処理リスナ追加
tasks.addInterruptListener(function(){
	console.log("タスク中断時処理");
}.bind(this));
```

FrameTaskList#addCompleteListener() で完了時の処理リスナを追加、  
FrameTaskList#addInterruptListener() でタスク中断時の処理リスナ追加できます。  

***

### 注意事項

***
メインループからFrameTaskExecuterを叩いてもらうために、スクリプトのロード時に即時実行でSceneManager.updateを再定義して上書きしています。  
影響を少なくするために元のSceneManager.updateを残す形にはしていますが、他プラグインと衝突した場合や処理順を調整したりしたい場合は、即時実行部分を適宜修正してください。  


