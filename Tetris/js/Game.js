(function () {
    window.Game = function () {
        // 行和列
        this.row = 20;
        this.col = 10;
        // 初始化
        this.init();
        this.isGameStarted = false;
        // 实例地图
        this.map = new Map();
        // 实例方块
        this.block = new Block();
        this.nextblock = new Block();
        // 事件监听
        this.bindEvent();
        // 得分
        this.score = 0;
        this.level = 1;
        // 速度
        this.during = 25;
    };

    Game.prototype.init = function () {
        // 创建空表格
        var $table = $("<table></table>");
        $table.addClass('tab1');
        // 渲染行和列
        for (let i = 0; i < this.row; i++) {
            let $tr = $("<tr></tr>");
            for (let j = 0; j < this.col; j++) {
                let $td = $("<td></td>");
                $tr.append($td);
            }
            $tr.appendTo($table);
        }
        // 打印表格
        $($table).appendTo("body");
        // 方块预览窗口
        let $table2 = $("<table></table>");
        $table2.addClass('tab2');
        for (let i = 0; i < 4; i++) {
            let $tr2 = $("<tr></tr>");
            for (let j = 0; j < 4; j++) {
                let $td2 = $("<td></td>");
                $tr2.append($td2);
            }
            $tr2.appendTo($table2);
        }
        $($table2).appendTo("body");
    };

    Game.prototype.setColor = function (row, col, num) {
        $(".tab1").find("tr").eq(row).children("td").eq(col).addClass("c" + num);
    };
    Game.prototype.setNextColor = function () {
        for (let i = 0; i < this.nextblock.block.length; i++) {
            for (let j = 0; j < this.nextblock.block[0].length; j++) {
                if (this.nextblock.block[i][j])
                    $(".tab2").find("tr").eq(i).children("td").eq(j).addClass("c" + this.nextblock.block[i][j]);
            }
        }
    };
    // 清屏
    Game.prototype.clear = function () {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                $(".tab1").find("tr").eq(i).children("td").eq(j).removeClass();
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                $(".tab2").find("tr").eq(i).children("td").eq(j).removeClass();
            }
        }
    };
    Game.prototype.clearBlock = function () {
        // 清除当前方块在画布上的图像
        for (let rowOffset = 0; rowOffset < this.block.block.length; rowOffset++) {
            for (let colOffset = 0; colOffset < this.block.block[rowOffset].length; colOffset++) {
                if (this.block.block[rowOffset][colOffset]) { // 只清除实际占用的方块
                    const gridRow = this.block.row + rowOffset;
                    const gridCol = this.block.col + colOffset;
                    if (gridRow >= 0 && gridRow < this.row && gridCol >= 0 && gridCol < this.col) {
                        $("tr").eq(gridRow).children("td").eq(gridCol).removeClass(); // 清除样式
                    }
                }
            }
        }
    };

    // 事件监听
    Game.prototype.bindEvent = function () {
        let self = this;
        let fastDropInterval = null;
        this.isFastDropping = false; // 添加状态标识

        $(document).keydown(function (event) {
            const keyActions = {
                'a': () => self.block.check(self.block.row, self.block.col - 1) && (self.block.col--),
                'd': () => self.block.check(self.block.row, self.block.col + 1) && (self.block.col++),
                'A': () => self.block.check(self.block.row, self.block.col - 1) && (self.block.col--),
                'D': () => self.block.check(self.block.row, self.block.col + 1) && (self.block.col++),
                's': () => self.block.check(self.block.row + 1, self.block.col) && (self.block.row++),
                'ArrowRight': () => { self.block.block = self.block.rotateRight(self.block.block); },
                'ArrowLeft': () => { self.block.block = self.block.rotateLeft(self.block.block); },
                ' ': () => {
                    if (fastDropInterval) return;

                    self.isFastDropping = true; // 设置快速下降状态

                    // 开始快速下降
                    fastDropInterval = setInterval(() => {
                        self.clearBlock();
                        if (self.block.check(self.block.row + 1, self.block.col)) {
                            self.block.row++;
                            self.block.render();
                        } else {
                            // 到达底部，停止快速下降
                            clearInterval(fastDropInterval);
                            fastDropInterval = null;
                            self.isFastDropping = false; // 重置状态
                        }
                    }, 20);
                },
                'Enter': () => {
                    if (!self.isGameStarted) {
                        self.isGameStarted = true;
                        self.start();
                    }
                }
            };

            const action = keyActions[event.key];
            if (action) action();
        });
    };
    // 检测方块是否连成一行

    Game.prototype.start = function () {
        let self = this;
        // 帧编号
        this.f = 0;
        this.timer = setInterval(function () {
            self.f++;
            // 清屏
            self.clear();
            // 渲染
            self.block.render();
            self.setNextColor();
            self.map.render();
            // 下落
            self.f % self.during == 0 && self.block.checkDown();
        }, 20);
    };
})()