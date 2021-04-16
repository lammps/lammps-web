var buttonUpdate, buttonSave, buttonHide
function createGUI() {
    // Build GUI
    var toolbar = document.getElementById( 'toolbar' );
    buttonUpdate = document.createElement( 'button' );
    buttonUpdate.className = 'button';
    buttonUpdate.disabled = true
    buttonUpdate.appendChild( document.createTextNode( 'Loading ...' ) );
    buttonUpdate.addEventListener( 'click', function ( event ) {
        var value = editor.getValue();
        currentScript = value;
        runScript();
        $('#inputline').focus();
    }, false );
    toolbar.appendChild( buttonUpdate );

    buttonAnimate = document.createElement( 'button' );
    buttonAnimate.className = 'button';
    buttonAnimate.disabled = true
    buttonAnimate.appendChild( document.createTextNode( 'Run & Animate' ) );
    buttonAnimate.addEventListener( 'click', function ( event ) {
        var value = editor.getValue();
        currentScript = value;
        animateScript();
        $('#inputline').focus();
    }, false );
    toolbar.appendChild( buttonAnimate );

    buttonClear = document.createElement( 'button' );
    buttonClear.className = 'button';
    buttonClear.appendChild( document.createTextNode( 'Clear Output' ) );
    buttonClear.addEventListener( 'click', function ( event ) {
        $('#myconsoleoutput').empty();
        $('#inputline').focus();
    }, false );
    toolbar.appendChild( buttonClear );

    // buttonSave = document.createElement( 'button' );
    // buttonSave.className = 'button';
    // buttonSave.textContent = 'save';
    // buttonSave.addEventListener( 'click', function ( event ) {
    //     save();
    // }, false );
    // toolbar.appendChild( buttonSave );

    buttonHide = document.createElement( 'button' );
    buttonHide.className = 'button';
    buttonHide.textContent = 'hide code';
    buttonHide.addEventListener( 'click', toggleEditorVisible, false );
    toolbar.appendChild( buttonHide );

    
    var inputline = document.getElementById("inputline");
    inputline.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            currentScript = inputline.value
            runInputCommands()
            inputline.value = '';
        }
    })
}

function save() {
    documents[ 0 ].code = codemirror.getValue();

    localStorage.codeeditor = JSON.stringify( documents );

    var blob = new Blob( [ codemirror.getValue() ], { type: documents[ 0 ].filetype } );
    var objectURL = URL.createObjectURL( blob );

    buttonDownload.href = objectURL;

    var date = new Date();
    buttonDownload.download = documents[ 0 ].filename;

    // buttonSave.style.display = 'none';
    buttonDownload.style.display = '';
}

function toggleEditorVisible() {
    var code = document.getElementById( 'ide' );
    var glwindow = document.getElementById("webglwindow")
    if ( code.style.display === '' ) {
        buttonHide.textContent = 'show code';
        code.style.display = 'none';
        buttonUpdate.style.display = 'none';
        buttonAnimate.style.display = 'none';
        buttonClear.style.display = 'none';
        //buttonSave.style.display = 'none';
        glwindow.style.height = (window.innerHeight  - 8) + "px";
    } else {
        buttonHide.textContent = 'hide code';
        code.style.display = '';
        buttonUpdate.style.display = '';
        buttonAnimate.style.display = '';
        buttonClear.style.display = '';
        //buttonSave.style.display = '';
        glwindow.style.height = '';
    }
    onWindowResize();
}

function initVSplit() {
  var dragY = 0;
  var deltaY = 0;

  element = document.getElementById("vseparator");
  element.onmousedown = dragMouseDown;

  function dragMouseDown( e )
  {
    dragY = e.clientY;
    document.onmousemove = onMouseMove;
    document.onmouseup = () => { document.onmousemove = document.onmouseup = null; }
  }

  function onMouseMove( e )
  {
    const currentY = e.clientY;

    deltaY = currentY - dragY;

    const offsetTop = element.offsetTop;

    const first = document.getElementById("ide");
    const second = document.getElementById("webglwindow");
    let firstHeight = first.offsetHeight;
    let secondHeight = second.offsetHeight;
    element.style.top = offsetTop + deltaY + "px";
    firstHeight += deltaY;
    secondHeight -= deltaY;
    dragY = currentY;
    first.style.height = firstHeight + "px";
    second.style.height = secondHeight + "px";
    onWindowResize();
  }
}

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    viewportMargin: Infinity,
    extraKeys: {"Ctrl-Space": "autocomplete"}
});

editor.setOption("theme", "monokai");

createGUI();
initVSplit();

document.addEventListener( 'keydown', function ( event ) {
    if ( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ) {
        event.preventDefault();
        save();
    }

    if ( event.keyCode === 82 && ( event.ctrlKey === true || event.metaKey === true ) ) {
        event.preventDefault();
        var value = editor.getValue();
        currentScript = value
        runScript()
    }
}, false );

Module["onRuntimeInitialized"] = function() {
    var callbackPointer = addFunction(synchronizeLAMMPS, 'v')
    Atomify.setCallback(callbackPointer)
    
    buttonUpdate.disabled = false
    buttonAnimate.disabled = false
    buttonUpdate.innerHTML = "run lammps script"
    initLAMMPS();
    $('#inputline').focus();
}

initGL();
