import { DealerCollectionEntry } from "./DealerCollectionEntry";

export class DealerCollectionManager {
  private static instance: DealerCollectionManager;

  private entries = new Map<string, DealerCollectionEntry>();

  static getInstance() {
    if (!DealerCollectionManager.instance) {
      DealerCollectionManager.instance = new DealerCollectionManager();
    }

    return DealerCollectionManager.instance;
  }

  private constructor() {}

  discoverDealer(dealerId: string) {
    const entry = this.getOrCreateEntry(dealerId);

    entry.discovered = true;
  }

  unlockSignatureToken(dealerId: string) {
    const entry = this.getOrCreateEntry(dealerId);

    entry.discovered = true;

    entry.signatureTokenUnlocked = true;
  }

  isDealerDiscovered(dealerId: string): boolean {
    return this.entries.get(dealerId)?.discovered ?? false;
  }

  isSignatureTokenUnlocked(dealerId: string): boolean {
    return this.entries.get(dealerId)?.signatureTokenUnlocked ?? false;
  }

  private getOrCreateEntry(dealerId: string): DealerCollectionEntry {
    let entry = this.entries.get(dealerId);

    if (!entry) {
      entry = {
        dealerId,
        discovered: false,
        signatureTokenUnlocked: false,
      };

      this.entries.set(dealerId, entry);
    }

    return entry;
  }
}
