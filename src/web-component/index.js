import { LitElement } from "lit-element";

class PdbTopologyViewer extends LitElement {

  static get properties() {
    return {
      pdbId: { type: String, attribute: 'pdb-id'},
      entityId: { type: String, attribute: 'entity-id'},
      chainId: { type: String, attribute: 'chain-id'}
    };
  }

  validateParams() {
    if(typeof this.pdbId == 'undefined' || typeof this.entityId == 'undefined' || typeof this.chainId == 'undefined') return false;
    return true
  }

  connectedCallback() {
    super.connectedCallback();
  }

  invokePlugin(){
    let paramValidatity = this.validateParams();
    if(!paramValidatity) return

    // create an instance of the plugin
    if(typeof this.viewInstance == 'undefined') this.viewInstance = new PdbTopologyViewerPlugin();
    this.viewInstance.render(this, this.entityId, this.pdbId, this.chainId);
  }

  updated() {
    this.invokePlugin();
  }

  createRenderRoot() {
    return this;
  }

}

export default PdbTopologyViewer;

customElements.define('pdb-topology-viewer', PdbTopologyViewer);