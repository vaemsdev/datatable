
    var DataTable = {
    
        'init': function(config){

            this.data = config.data;
            this.columns = config.columns;
            this.config = config.config;
            this.table.selector = document.querySelector(config.selector);
            this.table.name = config.selector;

            if( this.table.tbody == '' ) this.table.tbody = document.createElement('tbody')
            if( this.table.thead == '' ) this.table.thead = document.createElement('thead')

            return this;
        },
        'config': undefined,
        'table': {
            selector: '',
            name: '',
            tbody: '',
            thead: ''
        },
        'columns': [],
        'filter': {
            term: "",
            data: []
        },
        'search': function(opt){
            this.filter.term = opt.term;
            
            this.filter.data = this.data.filter(row => {
                
                return Object.keys(this.data[0]).map( key => {
                    
                    return row[key].toString().toLowerCase().indexOf(opt.term.toLowerCase()) > -1;
                }).indexOf(true) > -1 ? true : false;
            });

            this.clear().load();
        },
        'data': [],
        'header': function(){
            
        },
        'clear': function(){

            var body = document.querySelector( this.table.name + ' tbody');
            
            if(body != null)
                body.innerHTML = '';
            
            return DataTable;
        },
        'load': function(){

            var _ = this;
            
            var keys = Object.keys(this.columns);
            
            if( document.querySelector(this.table.name + ' thead') == null){
            
                var head_tr = document.createElement('tr');

                keys.map( field => {
                    
                    var th = document.createElement('th');
                    th.innerHTML = this.columns[field].alias;

                    th.addEventListener('click', function(e){

                        if(this.dataset['order'] == undefined){
                            this.dataset['order'] = 'asc';
                        }
                        
                        this.dataset['order'] == 'asc' ? 
                            this.dataset['order'] = 'desc':
                            this.dataset['order'] = 'asc';

                        _.orderby({
                            field: field,
                            order: this.dataset['order']
                        });

                        _.clear().load();
                        
                    });

                    head_tr.appendChild(th);
                });
                this.table.thead.appendChild(head_tr);
            }
            
            this.table.selector.appendChild(this.table.thead);
            this.table.selector.appendChild(this.table.tbody);
            
            var filter = this.filter.term.length == 0 ? this.data : this.filter.data;

            filter.map( (row,rowIndex) => {

                var tr = document.createElement('tr');
                
                var len = Object.keys(row).length;
                var type = '';

                for(var i = 0; i < len; i++){
                    
                    var td = document.createElement('td');

                    rawElement = this.columns[Object.keys(row)[i]];

                   
                    if( rawElement.type == 'dropdown' ){

                         /* dropdown */

                        var tmp_div = document.createElement('div');
                        tmp_div.innerHTML = rawElement.renderHTML.trim();
                        tmp_div.firstChild.dataset['id'] = Object.keys(row)[i];
                        
                        for(var x = 0; x < tmp_div.firstChild.children.length; x++){
                            
                            if(tmp_div.firstChild.children[x].value.toLowerCase() == row[Object.keys(row)[i]].toLowerCase())
                                tmp_div.firstChild.children[x].setAttribute('selected','selected');
                        }

                        td.innerHTML = tmp_div.firstChild.outerHTML;

                        td.firstChild.addEventListener('change', function(){
                            _.data[rowIndex][this.dataset.id] = this.value;
                        });
                    }
                    else if(rawElement.type == 'textbox'){
                        
                        /* Textbox */
                        var tmp_div = document.createElement('div');
                        tmp_div.innerHTML = rawElement.renderHTML.trim();
                        
                        tmp_div.firstChild.setAttribute('value' , row[Object.keys(row)[i]]);
                        tmp_div.firstChild.dataset['id'] = Object.keys(row)[i];
                        td.innerHTML = tmp_div.firstChild.outerHTML;

                        td.firstChild.addEventListener('change', function(){ 

                            _.data[rowIndex][this.dataset.id] = this.value;
                        });
                    }
                    else if( rawElement.type == 'text' )
                        td.innerHTML = row[Object.keys(row)[i]];

                    tr.appendChild(td);
                }

                this.table.tbody.appendChild(tr);
            });

        },
        'orderby': function(config){

            var ths = this.table.thead.children[0].children;

            Object.keys(ths).map( th => {

                if( ths[th].innerText != config.field)
                    ths[th].dataset['order'] = '';
            });

            this.data.sort(function(a,b){

                if (config.order == 'asc') {
                    return (a[config.field] > b[config.field]) ? 1 : ((a[config.field] < b[config.field]) ? -1 : 0);
                } else {
                    return (b[config.field] > a[config.field]) ? 1 : ((b[config.field] < a[config.field]) ? -1 : 0);
                }
            });

        },
        export: function(){
            return this.data;
        }
    }