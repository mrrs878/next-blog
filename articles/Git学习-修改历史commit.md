---
title: "Git学习-修改历史commit"
tags: "Git rebase"
categories: "Git"
description: ""
createDate: "2022-04-17 20:42:00"
updateDate: "2022-04-17 21:35:28"
---


有时候我们在提交代码时选错了git账号或者初始化仓库时没有配置git账号，恰好你也忽略掉了git的提示：

``` shell
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author
```

在这之后，你可能又进行了几次提交......

某一时刻你突然意识到好像有什么不对劲🤔

![事情并不简单](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/shiqingbingbujiandan.jpeg)

慌忙中执行了一下`git log`

``` shell
git log

commit b9955bf47f6437c2d72daf99e809737bbb79f2e1 (HEAD -> master)
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:49:01 2022 +0800

    fix: fix 1.1

commit ee0c985a1f158dcfe72b319727f401ae0742ed23
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:48:44 2022 +0800

    fix: fix 1.0

commit f6bac54c00f6b869894e8214aae7b8aaacdec5d5
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:47:23 2022 +0800

    feat: 1.0
```

寄了🙁

`Author`全是另一个，假设刚好你的团队是按照 bug数/代码量 来进行代码质量评估的，那现在岂不是自己给自己挖坑，强行拉低分母

![我tm怎么这么垃圾](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/wtmlaji.jpeg)

稳住别慌，问题不大。git这么牛逼的东西怎么可能没想到我们这种傻瓜操作呢？接下来我会分几种不同的情况分别给出解决方案

首先，感谢祖师爷！

## 只修改最后一次提交

假如你只是提交了一次就发现不对劲，那么你可以很简单地挽救回来，执行以下命令即可：

``` shell
# 注意邮箱需包括<>尖括号
git commit --amend --author="NewAuthor <NewEmail@address.com>"
```

或者在项目目录下配置好git账号后执行：

``` shell
git commit --amend --reset-author
```

此时`git log`长这样

``` shell
git log

commit 8b7c9afb16d25a89cb2d8c3d864e8422c088966c (HEAD -> master)
Author: mrrs878 <mrrs878@foxmail.com>
Date:   Sun Apr 17 20:49:01 2022 +0800

    fix: fix 1.1

commit ee0c985a1f158dcfe72b319727f401ae0742ed23
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:48:44 2022 +0800

    fix: fix 1.0

commit f6bac54c00f6b869894e8214aae7b8aaacdec5d5
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:47:23 2022 +0800

    feat: 1.0
```

好耶！🎉

那假如你是提交了好几次才记起来了呢

![苍天呐](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/cangtianna.png)

## 修改历史提交

依旧稳住别慌，问题不大

此时就要祭出`git rebase`了

假如你的`git log`长这样

``` shell
git log

commit 8b7c9afb16d25a89cb2d8c3d864e8422c088966c (HEAD -> master)
Author: mrrs878 <mrrs878@foxmail.com>
Date:   Sun Apr 17 20:49:01 2022 +0800

    fix: fix 1.1

commit ee0c985a1f158dcfe72b319727f401ae0742ed23
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:48:44 2022 +0800

    fix: fix 1.0

commit f6bac54c00f6b869894e8214aae7b8aaacdec5d5
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:47:23 2022 +0800

    feat: 1.0
```

（没错，我还是拿的上面举例子👆）

假如你要修复`commit message`为`fix: fix 1.0`的这个`commit`，执行这个命令：

``` shell
# -i 后面跟的是fix: fix1.0之前的一个commit的hash
git rebase -i f6bac54c00f6b869894e8214aae7b8aaacdec5d5
```

或者这样:

``` shell
# HEAD~2 表示后退两步
git rebase -i HEAD~2
```

（推荐直接写hash值，当你的commit落后太多不好计算🤣）

此时你的终端大概率可能会变成这样：

``` shell
echo@echodeMBP  ~/Frontend/test/git-commit-change  ➦ ee0c985 >R> 
```

这两个命令执行的结果都是一样的：

``` shell
pick ee0c985 fix: fix 1.0
pick 8b7c9af fix: fix 1.1

# Rebase f6bac54..8b7c9af onto f6bac54 (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
```

此时会进入命令行交互状态

光标移动到选择你要修改的那个`commit`，并将前方的`pick`改为`edit`，然后`:` + `wq`保存退出

此时终端会打印这个消息

``` shell
Stopped at ee0c985...  fix: fix 1.0
You can amend the commit now, with

  git commit --amend 

Once you are satisfied with your changes, run

  git rebase --continue
```

接着执行这个命令：

``` shell
git commit --amend --reset-author
```

或者最上面那个：

``` shell
git commit --amend --author="NewAuthor <NewEmail@address.com>"
```

此时又会进入命令行交互界面，类似于执行`git commit -m "xxxx"`时。由于我们什么都没改，因此可以`:` + `wq`退出即可

最后执行：

``` shell
git rebase --continue
```

这时候再`git log`一下看看效果👀

``` shell
commit 24ff96047eeb5531841b1d93242af992b6e54fcc (HEAD -> master)
Author: mrrs878 <mrrs878@foxmail.com>
Date:   Sun Apr 17 20:49:01 2022 +0800

    fix: fix 1.1

commit 40074be6073f9f76817665d6de078143dbf6739d
Author: mrrs878 <mrrs878@foxmail.com>
Date:   Sun Apr 17 21:14:52 2022 +0800

    fix: fix 1.0

commit f6bac54c00f6b869894e8214aae7b8aaacdec5d5
Author: echo <echo@echodeMBP.lan>
Date:   Sun Apr 17 20:47:23 2022 +0800

    feat: 1.0
```

好耶！成功了 🎉

到这里可以解决大多数的人的问题了，那可能会有人问了，如果我一开始就是错的怎么办呢？

![麻了](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/male.jpeg)

## 修改第一次提交

依旧问题不大，将上面的

``` shell
git rebase -i xxx
```

替换成

``` shell
git rebase -i --root
```

这时你会发现可以修改第一次提交了

``` shell
pick f6bac54 feat: 1.0
pick 40074be fix: fix 1.0
pick 24ff960 fix: fix 1.1

# Rebase 24ff960 onto fba660d (3 commands)
```

接下来的就不用我教你了吧

## 总结

- 如果是最后一次提交错误，可以简单地执行`git commit --amend --author="NewAuthor <NewEmail@address.com>"`或`git commit --amend --reset-author`来修改信息

- 如果是某一次提交错误，可以通过`git rebase -i xxx` + 第一种的命令来修改信息

- 如果要修改第一次提交，可以将第二种的`git rebase -i xxx`替换成`git rebase -i --root`来修改信息

结束！

## 参考

[Git修改提交历史中的作者及邮箱信息](https://www.jianshu.com/p/51f5cbb81cae)

[Change first commit of project with Git?](https://stackoverflow.com/questions/2246208/change-first-commit-of-project-with-git)
