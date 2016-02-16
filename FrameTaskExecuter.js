//=============================================================================
// FrameTaskExecuter.js
//=============================================================================

/*:
 * @plugindesc FrameTaskExecuter
 * @author midori
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc フレームの更新と同期してタスクを実行するクラスを追加します。
 * @author midori
 *
 * @help このプラグインにはプラグインコマンドはありません。グローバルの名前空間にクラスを追加するため名前の衝突に注意してください。
 */


function FrameTaskExecuter() {
    this.taskLists = [];
    return this;
};

FrameTaskExecuter.update = function () {
    var completeTasks = [];
    this.taskLists.forEach(function (task) {
        if (!task.update()) {
            completeTasks.push(task);
        }
    }.bind(this));

    //delete complete task
    completeTasks.forEach(function (task) {
        var idx = this.taskLists.indexOf(task);
        this.taskLists.splice(idx, 1);
    }.bind(this));
};

FrameTaskExecuter.execTask = function (taskList) {
    this.taskLists.push(taskList);
};


//------------------------------------------------------------------
function FrameTaskList() {
    this.tasks = [];
    this.isInterrupt = false;
    this.completeListenerList = [];
    this.interruptListenerList = [];

    return this;
};

FrameTaskList.prototype.update = function () {
    if (this.tasks.length <= 0) {
    	if(this.isInterrupt){
	        this.completeListenerList.forEach(function (listener) {
	            listener();
	        });
    	}
        return false;       // tasks complete
    }

    task = this.tasks.shift();
    if(task){
    	task();
    }

    return true;
};

FrameTaskList.prototype.addTask = function (taskFunc) {
    this.tasks.push(taskFunc);

    return this;
};

FrameTaskList.prototype.addWait = function (waitFrame) {
    for (var i = 0 ; i < waitFrame ; i++) {
        this.addTask(null);        // add empty frame
    }

    return this;
};

FrameTaskList.prototype.addCompleteListener = function (listener) {
    this.completeListenerList(listener);
};

FrameTaskList.prototype.interrupt = function () {
    this.tasks = [];
    this.isInterrupt = true;

    this.interruptListenerList.forEach(function (listener) {
        listener();
    });
};

FrameTaskList.prototype.addInterruptListener = function (listener) {
    this.interruptListenerList.push(listener);
};

(function () {
    var SceneManager_update_prototype = SceneManager.update;
    var counter = 0;
    SceneManager.update = function () {
        FrameTaskExecuter.update();

        SceneManager_update_prototype.call(this);
    };
})();




