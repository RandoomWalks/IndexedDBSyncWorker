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
        console.log(`GSet initialized: ${JSON.stringify(this.getItems())}`);
    }

    // Adds an item to the set and returns a new GSet to maintain immutability
    add(item: T): GSet<T> {
        const newItems = new Set(this.items);
        newItems.add(item);
        console.log(`Adding item: ${item}, New set: ${JSON.stringify(Array.from(newItems))}`);
        return new GSet(newItems);
    }


    // Merges another GSet into a new GSet and returns it, ensuring idempotency
    merge(otherSet: GSet<T>): GSet<T> {
        const newItems = new Set(this.items);
        for (const item of otherSet.getItems()) {
            newItems.add(item);
        }f
        console.log(`Merging sets. Current set: ${JSON.stringify(this.getItems())}, Merged set: ${JSON.stringify(Array.from(newItems))}`);
        return new GSet(newItems);
    }


    // Retrieves all items in the set as an array
    getItems(): T[] {
        console.log(` getItems(): items : ${Array.from(this.items)}`);
        return Array.from(this.items);
    }

    // Serializes the set to a JSON string.
    toJSON(): string {
        const json = JSON.stringify(this.getItems());
        console.log(`Serializing GSet: ${json}`);
        return json;
    }

    // Deserializes the set from a JSON string.
    static fromJSON<U>(json: string): GSet<U> {
        console.log(`Deserializing GSet from JSON: ${json}`);
        return new GSet(JSON.parse(json));
    }

    // Utility method to get the size of the set.
    size(): number {
        console.log(`Current size of the set: ${this.items.size}`);
        return this.items.size;
    }
}

// Example usage:
// const gSet = new GSet<number>([1, 2, 3]);
// const gSetMerged = gSet.add(4).merge(new GSet<number>([5]));
// const json = gSetMerged.toJSON();
// const gSetDeserialized = GSet.fromJSON<number>(json);