interface IProps {
  scene: Phaser.Scene;
}

export class TreasuresAndMonsters2 {
  private unSubs: (() => void)[] = [];

  constructor(private props: IProps) {
    console.log("TreasuresAndMonsters2 created", props);
  }

  sub(sub: () => () => void) {
    this.unSubs.push(sub());
  }

  destroy() {
    this.unSubs.forEach(unSub => unSub());
    this.unSubs = [];
  }
}
