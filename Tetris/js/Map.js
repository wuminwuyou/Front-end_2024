(function () {
    window.Map = function () {
        this.mapCode = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        ];
    }
    // 渲染地图
    Map.prototype.render = function () {
        for (let i = 0; i < this.mapCode.length; i++) {
            for (let j = 0; j < this.mapCode[0].length; j++) {
                if (this.mapCode[i][j]) {
                    game.setColor(i, j, this.mapCode[i][j]);
                }
            }
        }
    };
    // 消除一行方块
    Map.prototype.checkRemove = function () {
        let cnt = 0;
        for (let i = 0; i < this.mapCode.length; i++) {
            if (this.mapCode[i].indexOf(0) === -1) {
                cnt++;
                this.mapCode.splice(i, 1);
                this.mapCode.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]);
                // 分数增加
            }
        }
        if (cnt === 4) {
            game.score += 1000 * cnt * (3 - Math.floor(game.during / 10));
        }
        else {
            game.score += 500 * cnt * (3 - Math.floor(game.during / 10));
        }

        if (game.score % 2000 === 0 && cnt) {
            game.level++;
            game.during -= 2;
            if (game.during <= 0) {
                game.during = 1;
            }
        }
        document.getElementById("score").innerHTML = "分数：" + game.score;
        if (game.during !== 1) {
            document.getElementById("level").innerHTML = "level：" + game.level;
        }
        else{
            document.getElementById("level").innerHTML = "level：max" ;
        }
    }
})();