Ext.namespace("Demo");

Demo.application = {
  init:function(){
    storeUserProcess = function (n, r, i) {
      var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Load users..."});
      myMask.show();

      Ext.Ajax.request({
        url: "ajax/cases",
        method: "POST",
        params: {},
                         
        success:function (result, request) {
                  storeUser.loadData(Ext.util.JSON.decode(result.responseText));
                  myMask.hide();
                },
        failure:function (result, request) {
                  myMask.hide();
                  Ext.MessageBox.alert("Alert", "Failure users load");
                }
      });
    };
    
    onMnuContext = function(grid, rowIndex,e) {
      e.stopEvent();
      var coords = e.getXY();
      mnuContext.showAt([coords[0], coords[1]]);
    };
    
    //Variables declared in html file
    var pageSize = parseInt(CONFIG.pageSize);
    var message = CONFIG.message;
    
    //stores
    var storeUser = new Ext.data.Store({
      proxy:new Ext.data.HttpProxy({
        url:    "ajax/searchcases",
        method: "POST"
      }),
      
      //baseParams: {"option": "LST", "pageSize": pageSize},
            
      reader:new Ext.data.JsonReader({
        root: "resultRoot",
        totalProperty: "resultTotal",
        fields: [{name: "APP_NUMBER"},
                 {name: "APP_INIT_DATE"},
                 {name: "APP_STATUS"},
                 {name: "USR_USERNAME"},
                 {name: "APP_UID"}
                ]
      }),
      
      //autoLoad: true, //First call
      
      listeners:{
        beforeload:function (store) {
          this.baseParams = {"option": "LST", "pageSize": pageSize};
        }
      }
    });
    
    var storePageSize = new Ext.data.SimpleStore({
      fields: ["size"],
      data: [["15"], ["25"], ["35"], ["50"], ["100"]],
      autoLoad: true
    });
    
    //
    var btnNew = new Ext.Action({
      id: "btnNew",
      
      text: "NewRE",
      iconCls: "button_menu_ext ss_sprite ss_add",
      
      handler: function() {
        Ext.MessageBox.alert("Alert", message);
      }
    });
    
    var btnEdit = new Ext.Action({
      id: "btnEdit",
      
      text: "Edit",
      iconCls: "button_menu_ext ss_sprite ss_pencil",
      disabled: true,
      
      handler: function() {
        Ext.MessageBox.alert("Alert", message);
      }
    });
    
    var btnDelete = new Ext.Action({
      id: "btnDelete",
      
      text: "Delete",
      iconCls: "button_menu_ext ss_sprite ss_delete",
      disabled: true,
      
      handler: function() {
        Ext.MessageBox.alert("Alert", message);
      }
    });
    
    var btnSearch = new Ext.Action({
      id: "btnSearch",
      
      text: "Search",
      
      handler: function() {
        var app_num = Ext.getCmp('txtSearch').getValue();

        Ext.getCmp('grdpnlUser').getStore().load({params: {app_num: app_num}});
      }
    });
    
    var mnuContext = new Ext.menu.Menu({
      id: "mnuContext",
      
      items: [btnEdit, btnDelete]
    });
    
    var txtSearch = new Ext.form.TextField({
      id: "txtSearch",
      maskRe:/[0-9.]/, // allow only numbers
      emptyText: "Enter search term",
      width: 150,
      allowBlank: true,
      
      listeners:{
        specialkey: function (f, e) {
          if (e.getKey() == e.ENTER) {

           var app_num = Ext.getCmp('txtSearch').getValue();

           Ext.getCmp('grdpnlUser').getStore().load({params: {app_num: app_num}});
         
          }
        }
      }
    });
    
    var btnTextClear = new Ext.Action({
      id: "btnTextClear",
      
      text: "X",
      ctCls: "pm_search_x_button",
      handler: function() {
        txtSearch.reset();
      }
    });
    
    var cboPageSize = new Ext.form.ComboBox({
      id: "cboPageSize",
      
      mode: "local",
      triggerAction: "all",
      store: storePageSize,
      valueField: "size",
      displayField: "size",
      width: 50,
      editable: false,
      
      listeners:{
        select: function (combo, record, index) {
          pageSize = parseInt(record.data["size"]);
          
          pagingUser.pageSize = pageSize;
          pagingUser.moveFirst();
        }
      }
    });
    
    var pagingUser = new Ext.PagingToolbar({
      id: "pagingUser",
      
      pageSize: pageSize,
      store: storeUser,
      displayInfo: true,
      displayMsg: "Displaying users " + "{" + "0" + "}" + " - " + "{" + "1" + "}" + " of " + "{" + "2" + "}",
      emptyMsg: "No roles to display",
      items: ["-", "Page size:", cboPageSize]
    });
       
    var cmodel = new Ext.grid.ColumnModel({
      defaults: {
        width:50,
        sortable:true
      },
      columns:[{APP_UID: "APP_UID", dataIndex: "APP_UID", hidden: true},
               {header: "id", dataIndex: "APP_NUMBER",width: 25, align: "left"},
               {header: "Status", dataIndex: "APP_STATUS", width: 25, align: "center"},
               {header: "Init Date", dataIndex: "APP_INIT_DATE", width: 25, align: "left"},
               {header: "Current User ", dataIndex: "USR_USERNAME", width: 25, align: "left"},
              
              ]
    });
    
    var smodel = new Ext.grid.RowSelectionModel({
      singleSelect: true,
      listeners: {
        rowselect: function (sm) {
          btnEdit.enable();
          btnDelete.enable();
        },
        rowdeselect: function (sm) {
          btnEdit.disable();
          btnDelete.disable();
        }
      }
    });
    
    var grdpnlUser = new Ext.grid.GridPanel({
      id: "grdpnlUser",
      
      store: storeUser,
      colModel: cmodel,
      selModel: smodel,
      
      columnLines: true,
      viewConfig: {forceFit: true},
      enableColumnResize: true,
      enableHdMenu: true, //Menu of the column
      
      tbar: [btnNew, "-", btnEdit, btnDelete, "-", "->", txtSearch, btnTextClear, btnSearch],
      bbar: pagingUser,

      title: "Cases",      
      
      renderTo: "divMain",
      
      listeners:{
        //on row double click
          rowdblclick: function(grid, index, e) {
             window.location.href = CONFIG.server + "/sysworkflow/en/neoclassic/cases/open?APP_UID="+storeUser.data.items[index].data.APP_UID+"&DEL_INDEX=1&action=sent";
        }
      
      }
    });
    
    var pnl = new Ext.Viewport( {
     id:'panel',
     frame:false,
     layout:'fit',
     items:grdpnlUser
    });
    
    //Initialize events
    storeUserProcess(pageSize, pageSize, 0);
    
    grdpnlUser.on("rowcontextmenu", 
      function (grid, rowIndex, evt) {
        var sm = grid.getSelectionModel();
        sm.selectRow(rowIndex, sm.isSelected(rowIndex));
      },
      this
    );
    
    grdpnlUser.addListener("rowcontextmenu", onMnuContext, this);
    
    cboPageSize.setValue(pageSize);
  }
}

Ext.onReady(Demo.application.init, Demo.application);