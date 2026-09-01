/**
 * Saarthi Welfare Knowledge Graph Engine
 * 
 * Represents semantic entities and relationships:
 * - Citizen / Household Member Nodes
 * - Scheme Nodes
 * - Document Nodes
 * - Ministry / Department Nodes
 * - Benefit Nodes
 * 
 * Relationships:
 * - (Citizen)-[:HAS_RELATION]->(HouseholdMember)
 * - (Citizen)-[:POSSESSES]->(Document)
 * - (Scheme)-[:REQUIRES]->(Document)
 * - (Scheme)-[:ADMINISTERED_BY]->(Ministry)
 * - (Scheme)-[:DELIVERS]->(Benefit)
 * - (Scheme)-[:MUTUALLY_EXCLUSIVE_WITH]->(Scheme)
 * - (Scheme)-[:PREREQUISITE_OF]->(Scheme)
 */

export class WelfareKnowledgeGraph {
  constructor() {
    this.nodes = new Map(); // id -> { id, type, label, properties }
    this.edges = []; // [{ from, to, relationship, properties }]
  }

  addNode(id, type, label, properties = {}) {
    this.nodes.set(id, { id, type, label, properties });
    return this;
  }

  addEdge(from, to, relationship, properties = {}) {
    this.edges.push({ from, to, relationship, properties });
    return this;
  }

  /**
   * Builds the connected graph from the current user session + schemes registry
   */
  static buildFromSession(citizen, householdMembers = [], schemes = [], documents = []) {
    const graph = new WelfareKnowledgeGraph();

    // 1. Citizen Primary Node
    const citizenId = citizen?.id || 'citizen_primary';
    graph.addNode(citizenId, 'CITIZEN', citizen?.name || 'Primary Citizen', {
      age: citizen?.age,
      gender: citizen?.gender,
      occupation: citizen?.occupation,
      income_annual: citizen?.income_annual,
      category: citizen?.category,
      state: citizen?.state
    });

    // 2. Household Member Nodes & Edges
    (householdMembers || []).forEach(member => {
      const memberId = member.id || `hm_${member.relation}_${member.name}`;
      graph.addNode(memberId, 'HOUSEHOLD_MEMBER', member.name, {
        relation: member.relation,
        age: member.age,
        occupation: member.occupation,
        income_annual: member.income_annual
      });

      graph.addEdge(citizenId, memberId, 'FAMILY_MEMBER', { relation: member.relation });
    });

    // 3. Citizen Document Nodes
    const docMap = new Map();
    (documents || []).forEach(doc => {
      const docName = typeof doc === 'string' ? doc : doc.name;
      const docId = `doc_${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!docMap.has(docId)) {
        docMap.set(docId, true);
        graph.addNode(docId, 'DOCUMENT', docName, {
          verified: typeof doc === 'object' ? doc.verified : true,
          digilocker: true
        });
        graph.addEdge(citizenId, docId, 'POSSESSES', { verified: true });
      }
    });

    // 4. Scheme Nodes, Ministry Nodes, and Required Document Links
    schemes.forEach(scheme => {
      const schemeNodeId = `scheme_${scheme.id}`;
      graph.addNode(schemeNodeId, 'SCHEME', scheme.short_name || scheme.name, {
        scheme_code: scheme.scheme_code,
        category: scheme.category,
        benefit_amount: scheme.benefit_amount || scheme.benefit,
        government_level: scheme.government_level || scheme.gov_level
      });

      // Ministry Node & Edge
      if (scheme.ministry) {
        const minId = `ministry_${scheme.ministry.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        if (!graph.nodes.has(minId)) {
          graph.addNode(minId, 'MINISTRY', scheme.ministry, {});
        }
        graph.addEdge(schemeNodeId, minId, 'ADMINISTERED_BY', {});
      }

      // Document Requirement Edges
      const requiredDocs = scheme.documents || scheme.required_documents || [];
      requiredDocs.forEach(rd => {
        const reqDocId = `doc_${rd.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        if (!graph.nodes.has(reqDocId)) {
          graph.addNode(reqDocId, 'DOCUMENT', rd, { verified: false });
        }
        graph.addEdge(schemeNodeId, reqDocId, 'REQUIRES_DOCUMENT', { mandatory: true });
      });
    });

    return graph;
  }

  /**
   * Traverses dependencies: Finds missing documents for a given scheme
   */
  findMissingDocuments(citizenId, schemeId) {
    const schemeNodeId = `scheme_${schemeId}`;
    const requiredDocEdges = this.edges.filter(
      e => e.from === schemeNodeId && e.relationship === 'REQUIRES_DOCUMENT'
    );
    const citizenDocEdges = this.edges.filter(
      e => e.from === citizenId && e.relationship === 'POSSESSES'
    );

    const possessedDocIds = new Set(citizenDocEdges.map(e => e.to));
    const missingDocs = [];

    requiredDocEdges.forEach(re => {
      if (!possessedDocIds.has(re.to)) {
        const node = this.nodes.get(re.to);
        if (node) missingDocs.push(node.label);
      }
    });

    return missingDocs;
  }

  /**
   * Returns a JSON Graph visualization object (nodes and links) for 3D/Canvas renderers
   */
  toGraphData() {
    const nodesList = Array.from(this.nodes.values()).map(n => ({
      id: n.id,
      name: n.label,
      type: n.type,
      ...n.properties
    }));

    const linksList = this.edges.map(e => ({
      source: e.from,
      target: e.to,
      type: e.relationship,
      ...e.properties
    }));

    return { nodes: nodesList, links: linksList };
  }
}

export default WelfareKnowledgeGraph;
