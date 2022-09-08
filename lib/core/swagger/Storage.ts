export class Storage {
  private targets: object[] = [];

  public addTarget(target: object) {
    const hasTarget = this.targets.find((t) => t === target);
    if (hasTarget) return;

    this.targets.push(target);
  }

  public getTargets() {
    return this.targets;
  }
}
