(function () {
    const allBlocks = {
        "S": [[0, 1, 1], [1, 1, 0]],
        "Z": [[2, 2, 0], [0, 2, 2]],
        "J": [[3, 0, 0], [3, 3, 3]],
        "L": [[0, 0, 4], [4, 4, 4]],
        "T": [[5, 5, 5], [0, 5, 0]],
        "I": [[0, 0, 0, 0], [6, 6, 6, 6]],
        "O": [[7, 7], [7, 7]]
    };
    let allType = ["S", "Z", "J", "L", "T", "I", "O"];
    window.Block = function () {
        // 加载地图
        this.map = new Map();
        if (!allType.length) {
            console.log(allType);
            allType = ["S", "Z", "J", "L", "T", "I", "O"];
        }
        const randomIndex = Math.floor(Math.random() * allType.length);
        // 标记为已出现
        this.type = allType[randomIndex];
        allType = allType.filter(item => item !== this.type);
        this.memory = this.type;
        this.block = allBlocks[this.type];
        this.rotateTime = Math.floor(Math.random() * 3);
        for (let i = 0; i < this.rotateTime; i++) {
            this.block = this.rotateRight(this.block);
        }
        // 居中
        this.row = 0;
        this.col = 4;
    };
    // 渲染方块
    Block.prototype.render = function () {
        for (let i = 0; i < this.block.length; i++) {
            for (let j = 0; j < this.block[0].length; j++) {
                if (this.block[i][j]) {
                    game.setColor(i + this.row, j + this.col, this.block[i][j]);
                }
            }
        }
    };
    // 方块碰撞检测
    Block.prototype.check = function (row, col) {
        for (let i = 0; i < this.block.length; i++) {
            for (let j = 0; j < this.block[0].length; j++) {
                // 检查方块内部的非零部分
                if (this.block[i][j]) {
                    // 检查对应地图位置是否越界或已被占用
                    if (game.map.mapCode[i + row] === undefined ||
                        game.map.mapCode[i + row][j + col] === undefined ||
                        game.map.mapCode[i + row][j + col]) {
                        return false; // 碰撞或越界
                    }
                }
            }
        }
        return true; // 没有碰撞
    };

    // 方块下落
    Block.prototype.checkDown = function () {
        if (!game.isFastDropping) { // 只有在非快速下降状态下执行
            if (this.check(this.row + 1, this.col)) {
                this.row++;
            } else {
                // 记录在 map 上
                for (let i = 0; i < this.block.length; i++) {
                    for (let j = 0; j < this.block[0].length; j++) {
                        if (this.block[i][j]) {
                            game.map.mapCode[i + this.row][j + this.col] = this.block[i][j];
                        }
                    }
                }
                game.block = game.nextblock;
                game.nextblock = new Block();
                game.map.checkRemove();
                // 判断游戏是否结束
                this.checkOver();
            }
        }
    };

    Block.prototype.checkOver = function () {
        for (let i = 0; i < game.map.mapCode.length; i++) {
            if (game.map.mapCode[0][i]) {
                clearInterval(game.timer);
                alert("游戏结束！\n本次得分为：" + game.score + "\n等级：" + game.level);
            }
        }
    }
    // 旋转还是有bug：可以检测旋转后的位置有无方块，但是却还是会渲染到map上，暂时不知道为什么，以后再改了
    // 检测旋转是否合法
    Block.prototype.checkRotate = function (row, col, matrix) {
        const map = this.map;
        // 重新检查移动后的方块
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j]) {
                    // 检查对应地图位置越界或是否已被占用
                    if (map.mapCode[i + row] === undefined ||
                        map.mapCode[i + row][j + col] === undefined ||
                        map.mapCode[i + row][j + col] !== 0) {
                        return false; // 碰撞
                    }
                }
            }
        }
        return true; // 没有碰撞
    };

    // 方块顺时针旋转90°
    Block.prototype.rotateRight = function (matrix) {
        const m = matrix.length; // 原矩阵行数
        const n = matrix[0].length; // 原矩阵列数
        const result = Array.from({ length: n }, () => Array(m).fill(0)); // 创建 n x m 的新矩阵
        // 旋转
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                // 将元素移动到新的位置
                result[j][m - 1 - i] = matrix[i][j];
            }
        }
        if (!this.checkRotate(this.row, this.col, result)) {
            return matrix;
        }
        return result;
    };
    // 逆时针旋转90°
    Block.prototype.rotateLeft = function (matrix) {
        const m = matrix.length; // 原矩阵的行数
        const n = matrix[0].length; // 原矩阵的列数
        const result = Array.from({ length: n }, () => Array(m).fill(0)); // 创建 n x m 的新矩阵

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                // 逆时针旋转逻辑
                result[n - 1 - j][i] = matrix[i][j];
            }
        }
        if (!this.checkRotate(this.row, this.col, result)) {

            return matrix;
        }
        return result;
    };

})();
