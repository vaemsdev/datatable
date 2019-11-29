
    var DataTable = {
    
        'init': function(config){

            this.data = config.data;
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

            console.log(this.filter.data)

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
            
            var keys = Object.keys(this.data[0]);
            
            if( document.querySelector(this.table.name + ' thead') == null){
            
                var head_tr = document.createElement('tr');

                keys.map( field => {
                    
                    var th = document.createElement('th');
                    th.innerHTML = field;

                    th.addEventListener('click', function(e){

                        if(this.dataset['order'] == undefined){
                            this.dataset['order'] = 'asc';
                        }
                        
                        this.dataset['order'] == 'asc' ? 
                            this.dataset['order'] = 'desc' :
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

            filter.map( row => {

                var tr = document.createElement('tr');

                var len = Object.keys(row).length;

                for(var i = 0; i < len; i++){
                    var td = document.createElement('td');

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

        }
    }