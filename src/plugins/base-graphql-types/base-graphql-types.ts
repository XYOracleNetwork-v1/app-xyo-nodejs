export const types = `
    type XyoAboutMe {
        name: String,
        version: String,
        ip: String,
        address: String,
        boundWitnessServerPort: Int!
        graphqlPort: Int!,
        index: Int
        peers: [String!]
    }

    interface List {
        meta: ListMeta!
    }

    type ListMeta {
        totalCount: Int!,
        endCursor: String,
        hasNextPage: Boolean!
    }

    type XyoBlock {
        humanReadable: JSON!
        bytes: String!
        publicKeys: [XyoKeySet!]
        signatures: [XyoSignatureSet!]
        heuristics: [XyoHeuristicSet!]
        signedHash: String!
    }

    type XyoBlockCollection {
        publicKey: String!
        blocks: [XyoBlock!]!
        publicKeySet: [String!]!
    }

    type XyoBlockList implements List {
        meta: ListMeta!
        items: [XyoBlock!]!
    }

    type XyoEntitiesList implements List {
        meta: ListMeta!
        items: [XyoEntity!]!
    }

    type XyoEntity {
        firstKnownPublicKey: String!
        allPublicKeys: [String!]!
        type: XyoEntityType!
        mostRecentIndex: Int!
    }

    type XyoEntityType {
        sentinel: Boolean!,
        bridge: Boolean!,
        archivist: Boolean!,
        diviner: Boolean!
    }

    type XyoHeuristicSet {
        array: [XyoObject!]
    }

    type XyoIntersectionList implements List {
        meta: ListMeta!
        items: [String!]!
    }

    type XyoKeySet {
        array: [XyoPublicKey!]
    }

    type XyoObject {
        value: String!
    }

    type XyoPublicKey {
        value: String!
    }

    type XyoSignature {
        value: String!
    }

    type XyoSignatureSet {
        array: [XyoSignature!]
    }

    type XyoTransaction {
        transactionType: String!
        data: JSON!
    }

    type XyoTransactionList implements List {
        meta: ListMeta!
        items: [XyoTransaction!]!
    }
`
