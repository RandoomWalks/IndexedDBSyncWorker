import { Service } from "typedi";

type ResolutionStrategy = 'client-wins' | 'server-wins' | 'merge';

@Service()
class ConflictResolver {
    constructor(private strategy: ResolutionStrategy = 'merge') {}

    async resolve(clientData: any, serverData: any): Promise<any> {
        switch (this.strategy) {
            case 'client-wins':
                return this.clientWins(clientData, serverData);
            case 'server-wins':
                return this.serverWins(clientData, serverData);
            case 'merge':
                return this.merge(clientData, serverData);
            default:
                throw new Error(`Unsupported resolution strategy: ${this.strategy}`);
        }
    }

    private async clientWins(clientData: any, serverData: any): Promise<any> {
        // Client data overrides server data
        return clientData;
    }

    private async serverWins(clientData: any, serverData: any): Promise<any> {
        // Server data overrides client data
        return serverData;
    }

    private async merge(clientData: any, serverData: any): Promise<any> {
        // Implement a sophisticated merge logic here
        return { 
            ...serverData, 
            ...clientData, 
            resolvedAt: new Date().toISOString() // Include a timestamp for when the merge occurred
        };
    }
}

export { ConflictResolver };
