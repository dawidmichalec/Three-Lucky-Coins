export class CheatManager {
  private cheats: Map<string, () => void> =
    new Map();

  private dealerCheat?: (
    dealerId: string,
  ) => void;

  register(
    code: string,
    action: () => void,
  ) {
    this.cheats.set(code, action);
  }

  registerDealerCheat(
    action: (dealerId: string) => void,
  ) {
    this.dealerCheat = action;
  }

  execute(code: string) {
    if (code.startsWith("dealer_")) {
      const dealerId =
        code.slice("dealer_".length);

      if (!dealerId) {
        console.log(
          "Dealer ID not provided.",
        );

        return;
      }

      this.dealerCheat?.(dealerId);

      return;
    }

    const cheat =
      this.cheats.get(code);

    if (!cheat) {
      console.log(
        "Unknown cheat:",
        code,
      );

      return;
    }

    cheat();
  }
}