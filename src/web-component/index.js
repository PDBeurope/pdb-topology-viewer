class PdbTopologyViewer extends HTMLElement {

  static get observedAttributes() {
    return ['entry-id', 'entity-id', 'chain-id', 'display-style', 'error-style', 'menu-style', 'subscribe-events'];
  }

  constructor() {
    super();
  }

  validateParams() {
    if(typeof this.entryId == 'undefined' || typeof this.entityId == 'undefined' || this.entryId == null || this.entityId == null) return false;
    return true
  }

  invokePlugin(){
    let paramValidatity = this.validateParams();
    if(!paramValidatity) return

    // create an instance of the plugin
    if(typeof this.pluginInstance == 'undefined') this.pluginInstance = new PdbTopologyViewerPlugin();
    
    let options = {
      entryId: this.entryId,
      entityId: this.entityId,
    }

    if(typeof this.chainId !== 'undefined' && this.chainId !== null) options['chainId'] = this.chainId;
    if(typeof this.displayStyle !== 'undefined' && this.displayStyle !== null) options['displayStyle'] = this.displayStyle;
    if(typeof this.errorStyle !== 'undefined' && this.errorStyle !== null) options['errorStyle'] = this.errorStyle;
    if(typeof this.menuStyle !== 'undefined' && this.menuStyle !== null) options['menuStyle'] = this.menuStyle;
    if(typeof this.subscribeEvents !== 'undefined' && this.subscribeEvents !== null) options['subscribeEvents'] = this.subscribeEvents;

    this.pluginInstance.render(this, options);

  }

  attributeChangedCallback() {
    this.entryId = this.getAttribute("entry-id");
    this.entityId = this.getAttribute("entity-id");
    this.chainId = this.getAttribute("chain-id");
    this.displayStyle = this.getAttribute("display-style");
    this.errorStyle = this.getAttribute("error-style");
    this.menuStyle = this.getAttribute("menu-style");
    this.subscribeEvents = this.getAttribute("subscribe-events");
    this.invokePlugin();
  }

}

export default PdbTopologyViewer;

customElements.define('pdb-topology-viewer', PdbTopologyViewer);