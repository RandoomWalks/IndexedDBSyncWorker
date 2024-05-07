/**
 * This class implements a Grow-only Set (G-Set) which is a basic CRDT (Conflict-free Replicated Data Type)
 * that supports adding elements and ensures that once an element is added, it cannot be removed.
 * This property makes it ideal for distributed systems where consistency during concurrent operations is crucial.
 */

export class GSet<T> {
    private items: Set<T>; // Internal representation of the set

    // Constructor initializes the set with an optional initial set of items
    constructor(initialItems?: Iterable<T>) {
        this.items = new Set(initialItems);
    }

    // Adds an item to the set and returns a new GSet to maintain immutability
    add(item: T): GSet<T> {
        const newItems = new Set(this.items);
        newItems.add(item);
        return new GSet(newItems);
    }

    // Merges another GSet into a new GSet and returns it, ensuring idempotency
    merge(otherSet: GSet<T>): GSet<T> {
        const newItems = new Set(this.items);
        for (const item of otherSet.getItems()) {
            newItems.add(item);
        }
        return new GSet(newItems);
    }

    // Retrieves all items in the set as an array
    getItems(): T[] {
        return Array.from(this.items);
    }

    // Serializes the set to a JSON string.
    toJSON(): string {
        return JSON.stringify(this.getItems());
    }

    // Deserializes the set from a JSON string.
    static fromJSON<U>(json: string): GSet<U> {
        return new GSet(JSON.parse(json));
    }

    // Utility method to get the size of the set.
    size(): number {
        return this.items.size;
    }
}

// Example usage:
// const gSet = new GSet<number>([1, 2, 3]);
// const gSetMerged = gSet.add(4).merge(new GSet<number>([5]));
// const json = gSetMerged.toJSON();
// const gSetDeserialized = GSet.fromJSON<number>(json);
