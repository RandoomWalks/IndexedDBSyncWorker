// In the context of CRDTs, a Grow-only Set (GSet) has the property that it only supports adding elements, and once added, elements can never be removed. This characteristic ensures that the set can only grow over time, hence the name. This is useful for situations where need to ensure that once an operation has been performed, it cannot be undone, which makes replication and merging of states from different sources straightforward.

//  serves as the data structure that manages synchronization across client and server. For instance, if synchronizing data between a client's IndexedDB and a server's MongoDB, GSet would help track the elements that have been added to the database on the client side, even when offline, and then merge these changes with the server once the client goes online.

// adding an element to a GSet is idempotent (adding it multiple times has the same effect as adding it once),  it's safe to apply the same set of operations in any order and any number of times, leading to consistent state across all replicas.

export class GSet<T> {
    private items: Set<T>;

    constructor(initialItems?: T[]) {
        this.items = new Set(initialItems || []);
    }

    add(item: T): void {
        this.items.add(item);
    }

    merge(otherSet: GSet<T>): void {
        otherSet.getItems().forEach(item => this.items.add(item));
    }

    getItems(): T[] {
        return Array.from(this.items);
    }
}