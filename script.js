debug = function (log_txt) {
    if (window.console != undefined) {
        console.log(log_txt);
    }
}
// DELETE?

$_GET = new Array
_get_set = function (_data)
{
	if (_data.match(/(.+?[^=])=(.*)/i))
	{
		eval("$_GET['" + RegExp.$1 + "'] = '" + RegExp.$2 + "';")
	}
}

_SearchIn  = location.href.replace(location.href.split('?')[0] + '?', '')
_Variables = _SearchIn.split('&')

if (_Variables.length < 2)
{
	_get_set(_SearchIn)
}
else
{
	for (_s = 0; _s < _Variables.length; _s++)
	{
		_get_set(_Variables[_s])
	}
}
// I might change my mind on the logic here and make None = White...
var player = "None";

if ($_GET['player']) {
   player = $_GET['player'];
}

var moveNumber = 1;  // keep this up-to-date

var i = 0;
var piece_sw = i++, piece_sb = i++, 
    piece_wq = i++, piece_bq = i++,
    piece_wk = i++, piece_bk = i++, 
    piece_wb = i++, piece_bb = i++,
    piece_wn = i++, piece_bn = i++,
    piece_wr = i++, piece_br = i++,
    piece_wp = i++, piece_bp = i++,
    piece_sbh = i++, piece_swh = i++,
    board_1 = i++, board_2 = i++, board_3 = i++, board_4=i++;

var hasWhiteKingMoved = "false";
var hasBlackKingMoved = "false";

function isBlack(piece) {
   return piece % 2 != 0;
}

function isWhite(piece) {
   return piece % 2 == 0;
}

function isPiece(piece) {
   return piece >= piece_wq;
}


function getPieceType(piece) {
   var delta = piece % 2;
   piece = piece - delta;

   if (piece == piece_wq) 
      return "queen";
   else if (piece == piece_wk) 
      return "king";
   else if (piece == piece_wb)
      return "bishop";
   else if (piece == piece_wn)
      return "knight";
   else if (piece == piece_wr) 
      return "rook";
   else if (piece == piece_wp)
      return "pawn";   
}

function getColour(piece) {
   if (piece % 2 == 0)
      return "white";
   else return "black";
}

var names = new Array();
var images = new Array();

//names[piece_sw] = "assets40/light square_40.png";
//names[piece_sb] = "assets40/dark square_40.png";
//names[piece_swh] = "assets40/light highlight_40.png";
//names[piece_sbh] = "assets40/dark highlight_40.png";

names[piece_wq] = "assets40/white queen_40.png";
names[piece_bq] = "assets40/black queen_40.png";
names[piece_wk] = "assets40/white king_40.png";
names[piece_bk] = "assets40/black king_40.png";
names[piece_wb] = "assets40/white bishop_40.png";
names[piece_bb] = "assets40/black bishop_40.png";
names[piece_wn] = "assets40/white knight_40.png";
names[piece_bn] = "assets40/black knight_40.png";
names[piece_wr] = "assets40/white rook_40.png";
names[piece_br] = "assets40/black rook_40.png";
names[piece_wp] = "assets40/white pawn_40.png";
names[piece_bp] = "assets40/black pawn_40.png";
    
//names[board_1] = "assets40/board_01_40.png";
//names[board_2] = "assets40/board_02_40.png";
//names[board_3] = "assets40/board_03_40.png";
names[board_4] = "board_04.jpg";

for (var i = 0; i < names.length; i++) {
    images[i] = new Image(40, 40);
    images[i].src = names[i];
}

function validate() {
   var missingData = "";

   var datums = new Array("wname", "bname", "wemail", "bemail");
   var datumTexts = {"wname":"White's name", "bname":"Black's name",
                     "wemail":"White's email", "bemail":"Black's email"};

   // Okay, go through
   for (var key in datumTexts) {
      // is key set?
      debug("Validating " + key + " = '" + document.getElementById(key).value + "'");

      if (document.getElementById(key).value == "") {
         missingData = missingData + datumTexts[key] + "; ";
      } else {
         // Remember to copy into the GET bit
         $_GET[key] = document.getElementById(key).value;
      }
   }
   
   if (missingData != "") {
      alert("Please fill in: " + missingData);
      return 0;

   }
   return 1;
}

/**
   Sends via a php call to the server
 */
function sendOLD() {

   debug("Sending");

   var address = "url=http://sucs.org/~will/BetterEmailChess/index.html";

   if (!validate()) {
      return;
   }

   // Change the button text to Sending move..., and also disable it
   var moveValue = document.getElementById("send").innerHTML;
   document.getElementById("send").innerHTML = "Sending move...";
   document.getElementById("send").disabled = 1;

   // FIXME Well this is ad hoc!
   // TODO use escape more consistently
   $_GET['bname'] = $_GET['bname'].replace(/ /g, "_");
   $_GET['wname'] = $_GET['wname'].replace(/ /g, "_");

   // Get the current list of moves, and add to them
   var moves = 'moves=' + get_all_moves();  // get_move comes from draw.js atm
   var namesEmails = "player=" + get_next_player() + 
                     "&number=" + moveNumber + 
                     "&wname=" + $_GET['wname'] + "&bname=" + $_GET['bname'] + 
        "&wemail=" + $_GET['wemail'] + "&bemail=" + $_GET['bemail'] + "&message=" + get_message();

   var pretty = escape(draw_html_table());
   var args = address + "&" + namesEmails + "&" + moves + "&pretty=" + pretty + "&move=" + moveValue;
   var http = false;

    debug(">>>>> pretty = " + draw_html_table());
    
   if(navigator.appName == "Microsoft Internet Explorer") {
       http = new ActiveXObject("Microsoft.XMLHTTP");
   } else {
       http = new XMLHttpRequest();
   }
    
   http.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
	    debug(">>> status = " + this.status + " and readyState= " + this.readyState);
	    // And change back again.
	    // TODO helpful to set to SENT, but I need to handle errors here too!
	    document.getElementById("send").innerHTML = "Move sent";
	    //document.getElementById("send").disabled = 1;
	    alert(this.responseText);
	}
    };    


   debug(">>>>> " + moveValue);

    // async
    //http.open("GET", "/sendmail3.php?" + args, true);
    http.open("POST", "sendmail4.php", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    debug(">> Sending...");
    http.send(args);
    debug(">> Sent...");
}


function send() {
   debug("Sending -- new version");

   var address = "url=http://sucs.org/~will/BetterEmailChess/index.html";

   if (!validate()) {
      return;
   }

   // Change the button text to Sending move..., and also disable it
   var moveValue = document.getElementById("send").innerHTML;
   document.getElementById("send").innerHTML = "Sending move...";
   document.getElementById("send").disabled = 1;

   // FIXME Well this is ad hoc!
   // TODO use escape more consistently
   $_GET['bname'] = $_GET['bname'].replace(/ /g, "_");
   $_GET['wname'] = $_GET['wname'].replace(/ /g, "_");

   // Get the current list of moves, and add to them
   var moves = 'moves=' + get_all_moves();  // get_move comes from draw.js atm
   var namesEmails = "player=" + get_next_player() + 
                     "&number=" + moveNumber + 
                     "&wname=" + $_GET['wname'] + "&bname=" + $_GET['bname'] + 
        "&wemail=" + $_GET['wemail'] + "&bemail=" + $_GET['bemail'] + "&message=" + get_message();

   var pretty = escape(draw_html_table());
   var args = address + "&" + namesEmails + "&" + moves + "&pretty=" + pretty + "&move=" + moveValue;
   var http = false;

    
    var played_player = $_GET['wname'];
    var other_player = $_GET['bname'];
    var to_address = $_GET['bemail'];
    if  (get_next_player() == "white") {
	played_player = $_GET['bname'];
	other_player = $_GET['wname'];
	to_address = $_GET['wemail'];
    }
    
    // TODO un-escape message
    var address =
	'http://www.betteremailchess.co.uk/?' + 
        'player=' + get_next_player() +
	'%26wname=' + $_GET['wname'] +
	'%26bname=' + $_GET['bname']  +
	'%26wemail=' + $_GET['wemail'] +
	'%26bemail=' + $_GET['bemail'] +
	'%26moves=' + get_all_moves() +
	'%26message=' + get_message().replace(/%20/g, "_");
    
    address = address.replace(/=/g, "%3d"); 
    
    var subject = "You have a new chess move (" + moveNumber + ") waiting from " + played_player;
    
    window.open("mailto:" + to_address + "?subject=" + subject + " &body=Please click here: " + address + "."); 
}



// coords of the pawn which jumped two spaces, in just the last move
var pawnJumpX = -1,
   pawnJumpY = -1;

var enPassantDone = false;

// state
var selectedX = -1,
   selectedY = -1;

// move made
var moveFromX = -1,
   moveFromY = -1,
   moveToX = -1,
   moveToY = -1;


var positions = new Array();
for (var i = 0; i < 8; i++) {
   positions[i] = new Array();
}

for (var i = 0; i < 8; i++) {
   for (var j = 0; j < 8; j++) {
      positions[i][j] = -1;
   }
}

var piece_taken = -1;
var currentMoveString = "";

// x, y
positions[0][0] = piece_br;
positions[1][0] = piece_bn;
positions[2][0] = piece_bb;
positions[3][0] = piece_bq;
positions[4][0] = piece_bk;
positions[5][0] = piece_bb;
positions[6][0] = piece_bn;
positions[7][0] = piece_br;

positions[0][1] = piece_bp;
positions[1][1] = piece_bp;
positions[2][1] = piece_bp;
positions[3][1] = piece_bp;
positions[4][1] = piece_bp;
positions[5][1] = piece_bp;
positions[6][1] = piece_bp;
positions[7][1] = piece_bp;

positions[0][6] = piece_wp;
positions[1][6] = piece_wp;
positions[2][6] = piece_wp;
positions[3][6] = piece_wp;
positions[4][6] = piece_wp;
positions[5][6] = piece_wp;
positions[6][6] = piece_wp;
positions[7][6] = piece_wp;

positions[0][7] = piece_wr;
positions[1][7] = piece_wn;
positions[2][7] = piece_wb;
positions[3][7] = piece_wq;
positions[4][7] = piece_wk;
positions[5][7] = piece_wb;
positions[6][7] = piece_wn;
positions[7][7] = piece_wr;

var letterAssoc = [];
letterAssoc["a"] = 0;
letterAssoc["b"] = 1;
letterAssoc["c"] = 2;
letterAssoc["d"] = 3;
letterAssoc["e"] = 4;
letterAssoc["f"] = 5;
letterAssoc["g"] = 6;
letterAssoc["h"] = 7;

var numberAssoc = [];
numberAssoc[-1] = "-1";
numberAssoc[0] = "a";
numberAssoc[1] = "b";
numberAssoc[2] = "c";
numberAssoc[3] = "d";
numberAssoc[4] = "e";
numberAssoc[5] = "f";
numberAssoc[6] = "g";
numberAssoc[7] = "h";


var takenPieces = [];

function get_move() {
   var move = numberAssoc[moveFromX] + moveFromY + numberAssoc[moveToX] + moveToY;

   return move;
}

function get_all_moves() {
   if ($_GET['moves']) {
      return $_GET['moves'] + "," + get_move();
   } else {
      return get_move();
   }
}

function get_message() {
   debug("Message sent = " + document.getElementById("extraMessage").value);
   return (escape(document.getElementById("extraMessage").value));
}

function getMoveString(movePiece, fromX, fromY, toX, toY, takenPiece) {
   var moveT = "";

   var takingPieceName = getPieceType(movePiece);

   moveT = takingPieceName + " ";

   var toY1 = toY + 1;
   var fromY1 = fromY + 1;

   var castled = "";

   var queenStr = "";

   var enPassantStr = "";

   if (queened == "true") {
      queenStr = " <b>queened</b>";
   }

   if (enPassantDone) {
      enPassantStr = " <b>en passant</b>";
   }

   if (fromX > -1) {
      moveT = moveT + numberAssoc[fromX] + (8 - parseInt(fromY));

      if (toX > -1) {
         moveT = moveT + numberAssoc[toX] + (8 - parseInt(toY));

         if (hasDoneCastled(positions, fromX, fromY, toX, toY) == "true") {
            castled = " <b>castled</b>";
         }

      }
   }

   if (takenPiece != -1) {
      var takenPieceName = getPieceType(takenPiece);
      moveT = moveT + " x " + takenPieceName;
   }

   var check = isOpponentCheck(positions);
   if (check == "true") {
      moveT = moveT + " <br><b>Check</b>";
      var checkmate = isOpponentCheckMate(positions);
      if (checkmate == "true") {
         moveT = moveT + " <b>mate</b>";
      }

      var checkmateUs = isPlayerCheckMate(positions);
      if (checkmateUs == "true") {
         moveT = moveT + " <b>mate</b>";
      }

   }

   check = isOpponentOpponentCheck(positions);
   if (check == "true") {
      moveT = moveT + " <br><b>check</b>";
      var checkmate = isPlayerCheckMate(positions);
      if (checkmate == "true") {
         moveT = moveT + " <b>mate!</b>";
         alert("Check mate");
      }
   }

   moveT = moveT + castled + queenStr + enPassantStr;

   return moveT;
}

function do_move(canvas, move) {
   // extract the coords
   var fromX = letterAssoc[move[0]];
   var fromY = move[1];
   var toX = letterAssoc[move[2]];
   var toY = move[3];

   var movingPiece = positions[fromX][fromY];

   piece_taken = positions[toX][toY];

   perform_move(fromX, fromY, toX, toY);

   if (getPieceType(positions[toX][toY]) == "pawn" &&
      Math.abs(fromY - toY) == 2) {
      pawnJumpX = toX;
      pawnJumpY = toY;
   } else {
      pawnJumpX = -1;
      pawnJumpY = -1;
   }

   currentMoveString = getMoveString(movingPiece, fromX, fromY, toX, toY, piece_taken);
}

function start_do_moves(canvas) {
   canvas = document.getElementById("myDrawing");

   // Apply moves, step by step
   moves = $_GET['moves'];

   // split by ,:
   var move_array = moves.split(",");

    do_next_move(move_array, 0);
}

function do_next_move(move_array, i) {
    if (i >= move_array.length) {
	finish_do_moves(i);
	return;
    }
    
    canvas = document.getElementById("myDrawing");
    
    do_move(canvas, move_array[i]);
    
    var prev_board = move_array.length - i;
    
    for (var b = 1; b <= 4; b++) {
	if (move_array.length - i >= b) {
            draw_board(
		document.getElementById("board" + b),
		document.getElementById("board" + b).width,
		document.getElementById("board" + b).height);
            document.getElementById("moveLabel" + b).innerHTML = "Move " + (i + 1) + "<br>" + currentMoveString;
	}	
    }
    
    document.getElementById("moveLabel").innerHTML = "Move: " + (i + 1);
    
    draw_board(canvas, canvas.width, canvas.height /*, moves*/);

    update_move_box();
  
    if (i > move_array.length - 3) {
	// Slowly draw the latest move.
	setTimeout(function(){
	    do_next_move(move_array, i+1);
	}, 500);
    } else {
	do_next_move(move_array, i+1);
    }

    // It's actually a bit annoying having all the moves replayed. But having the latest one replayed is
    // useful.
//    var delay = 100;
//    if (i > move_array.length - 3) {
//	delay = 1000;
//   }
//    setTimeout(function(){
//	do_next_move(move_array, i+1);
//    }, delay);
}

function finish_do_moves(i) {
   canvas = document.getElementById("myDrawing");

   moves = $_GET['moves'];

   draw_board(canvas, canvas.width, canvas.height /*, moves*/);

   // And update moveLabel
   document.getElementById("moveLabel").innerHTML = "Move: " + (i + 1);

   // This is defined in arguments.js, and used by email.js
   moveNumber = i + 1;

   // More hackery... reset the taken piece
   piece_taken = -1;

   // yet more, reset the enpassant blip
   enPassantDone = false;
}

function retry_move(canvas) {
   if (moveToX > -1) {
      if (enPassantDone) {
         positions[moveFromX][moveFromY] = positions[moveToX][moveToY];

         positions[moveToX][moveToY] = -1;

         // and where will the taken pawn come from? 
         positions[pawnJumpX][pawnJumpY] = piece_taken;

         enPassantDone = false;

      } else {

         positions[moveFromX][moveFromY] = positions[moveToX][moveToY];
         positions[moveToX][moveToY] = piece_taken;

      }

      // was the move a queening? 
      if (queened == "true") {
         var colour = getColour(positions[moveFromX][moveFromY]);
         if (colour == "white") {
            positions[moveFromX][moveFromY] = piece_wp;
         } else {
            positions[moveFromX][moveFromY] = piece_bp;
         }

         queened = "false";
      }

      // was the move a castle?
      if (hasCastled(positions, moveFromX, moveFromY, moveToX, moveToY) == "true") {
         if (moveToX == 6) {
            positions[7][moveToY] = positions[5][moveToY];
            positions[5][moveToY] = -1;
         } else if (moveToX == 2) {
            positions[0][moveToY] = positions[3][moveToY];
            positions[3][moveToY] = -1;
         } else {
            alert("Where has the king come from?");
         }
      }
   }
   moveFromX = -1;
   moveFromY = -1;
   moveToX = -1;
   moveToY = -1;
   draw_board(canvas, canvas.width, canvas.height /*, 1*/);

   update_move_box();
}

/**************************************************
      Some helper functions
****/

function isPlayersPiece(x, y) {

   debug("isPlayersPiece: x = " + x + ",  y = " + y);


   var p = positions[x][y];
   if (p == -1)
      return false;
   if (player == "white" || player == "None")
      return isWhite(p);
   else
      return isBlack(p);
}


/**************************************************/
function click(canvas, x, y) {
   var w = canvas.width / 8;
   var sx = screenXY(Math.floor(x / w));
   var sy = screenXY(Math.floor(y / w));

   if (moveFromX > -1) {
      // If we can, move this piece
      if (moveToX == -1) {
         var moveValidity = move_is_valid(positions, moveFromX, moveFromY, sx, sy, "1");

         if (moveValidity == "restart") {
            // we've touched another of our pieces, so, just reset
            retry_move(canvas);
         } else if (moveValidity == "castle_in_check") {
            alert("You can't castle while in check");
            retry_move(canvas);
	 } else if (moveValidity == "castle_already_moved") {
	    alert("You can't castle when your castle has already moved");
	    retry_move(canvas);
         } else if (moveValidity == "true" || moveValidity == "enpassant") {

            moveToX = sx;
            moveToY = sy;

            perform_move(moveFromX, moveFromY, moveToX, moveToY);

            if (isOpponentOpponentCheck(positions) == "true") {
               alert("You're in check!");
               retry_move(canvas);
            }

            update_move_box();
         } else {
            debug(moveValidity);
            retry_move(canvas);
         }
      } else {
         retry_move(canvas);
      }
   } else {
      // However, we only want to select our piece here
      if (isPlayersPiece(sx, sy)) {
         moveFromX = sx;
         moveFromY = sy;

         // and remember to update the move box
         update_move_box();
      }
   }

   draw_board(canvas, canvas.width, canvas.height /*, 1*/);
}

function update_move_box() {
   var enableSend = false;

   var moveT = "";

   var castled = "";

   var enPassantStr = "";

   if (enPassantDone) {
      enPassantStr += " <b>en passant</b>";
   }

   var queenStr = "";
   if (queened == "true") {
      queenStr = " <b>queened</b>";
   }

   if (moveFromX > -1) {
      moveT = moveT + numberAssoc[moveFromX] + (8 - parseInt(moveFromY));

      if (moveToX > -1) {
         moveT = moveT + numberAssoc[moveToX] + (8 - parseInt(moveToY));

         if (hasDoneCastled(positions, moveFromX, moveFromY, moveToX, moveToY) == "true") {
            castled = " <b>castled</b>";
         }
         enableSend = true;
      }
   }

   document.getElementById("send").disabled = !enableSend;

   var sendText = "please play move";
   if (moveT != "") {
      sendText = "move " + moveT;

      // Now add in a taking-thing
      if (piece_taken != -1) {
         var takenPieceName = getPieceType(piece_taken);
         sendText = sendText + " taking " + takenPieceName;
      }

      var check = isOpponentCheck(positions);
      if (check == "true") {
         sendText = sendText + " <b>check</b>";

         var checkmate = isOpponentCheckMate(positions);
         if (checkmate == "true") {
            sendText = sendText + " <b>mate</b>";
         }

      }

   }

   sendText = sendText + castled + queenStr + enPassantStr;

   document.getElementById("send").innerHTML = "" + sendText;

   var pieceName = Array();
   pieceName[0] = 'pawn';
   pieceName[1] = 'knight';
   pieceName[2] = 'bishop';
   pieceName[3] = 'rook';
   pieceName[4] = 'queen';
   var label = '';

   for (var i = 0; i < 5; i++) {
      var name = pieceName[i];
      var pawnsPlus = (count_pieces(positions, get_player(), name) -
         count_pieces(positions, get_next_player(), name));

      var plus = '';

      if (pawnsPlus > 0)
         plus = '+';


      if (pawnsPlus != 0) {
         label = label + ' ' + name + 's ' + plus + pawnsPlus;
      }

   }

   document.getElementById("scoreLabel").innerHTML = label;
}


function count_pieces(board, colour, type) {
   // Now just draw some squares for the moment...
   var count = 0;
   for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
         var piece = board[x][y];
         if (getColour(piece) == colour && getPieceType(piece) == type) {
            count++;
         }
      }
   }

   return count;
}

var queened = "false";

function perform_move(moveFromX, moveFromY, moveToX, moveToY) {

   var enPassant = isMoveEnPassant(positions, moveFromX, moveFromY, moveToX, moveToY);

   // make move
   if (enPassant == true) {
      piece_taken = positions[pawnJumpX][pawnJumpY];
   } else {
      piece_taken = positions[moveToX][moveToY];
   }

   // need this to undo of course
   queened = hasQueened(positions, moveFromX, moveFromY, moveToX, moveToY);

   if (piece_taken != -1) {
      takenPieces.push(piece_taken);
   }

   if (hasCastled(positions, moveFromX, moveFromY, moveToX, moveToY) == "true") {
      // which side? we know it must be legal at this point
      if (moveToX == 6) {
         positions[5][moveToY] = positions[7][moveToY];
         positions[7][moveToY] = -1;

      } else if (moveToX == 2) {
         positions[3][moveToY] = positions[0][moveToY];
         positions[0][moveToY] = -1;

      } else {
         alert("Error, we've castled, but how're we on this square?");
      }
   }

   if (queened == "true") {
      if (getColour(positions[moveFromX][moveFromY]) == "white") {
         positions[moveFromX][moveFromY] = piece_wq;
      } else {
         positions[moveFromX][moveFromY] = piece_bq;
      }
   }

   // Do move
   positions[moveToX][moveToY] = positions[moveFromX][moveFromY];
   positions[moveFromX][moveFromY] = -1;

   // enpassant
   if (enPassant == true) {
      positions[pawnJumpX][pawnJumpY] = -1;

      enPassantDone = true;

   } else {
      enPassantDone = false;
   }

   // have we just moved the king?
   if (getPieceType(positions[moveToX][moveToY]) == "king") {
       if (isBlack(positions[moveToX][moveToY])) {
	   hasBlackKingMoved = "true";
       } else {
	   hasWhiteKingMoved = "true";	   
       }
   }
}

function close_board(canvas) {
   var context = canvas.getContext('2d');
   context.fillStyle = 'Gray';
   context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_board(canvas, width, height /*, pieces*/) {
   // get the context
   var context = canvas.getContext('2d');

   // first, compute our piece width
   var w = width / 8;

   context.drawImage(images[board_4], 0, 0, width, height);

   // Now just draw some squares for the moment...
   for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
         if (positions[screenXY(x)][screenXY(y)] > -1) {
            context.drawImage(images[positions[screenXY(x)][screenXY(y)]], x * w, y * w, w - 1, w - 1);
         }
      }
   }
}

function screenXY(c) {
   if (player == "None" || player == "white") {
      return c;
   } else {
      return 7 - c;
   }
}

function render_html(background, colour, name) {
    //return name;
    return '<span style="padding: 0px 7px 0px 7px; width: 100px; height: 100px; font-size: 20pt; font-family: monospace; color: ' + colour + '; background-color: ' + background + ';">' + name + '</span>';
}

function render_html_td(background, colour, name) {
    //return name;
    return '<td align="center" style="width: 30px; height: 30px; font-size: 20pt; background-color: ' + background + ';">' + name + '</td>';
}


function render_piece(isBlackBackground, piece) {
    debug('???? ' + piece);
    var colour = "?";
    var name = "?";
    if (piece == -1) {
	colour = "white";
	name = "&nbsp;";
    } else if (piece == piece_br) {
	colour = "black";
	name = "&#9820;"; //"R";
    } else if (piece == piece_bn) {
	colour = "black";
	name = "&#9822;"; //"N";
    } else if (piece == piece_bb) {
	colour = "black";
	name = "&#9821;"; //"B";
    } else if (piece == piece_bq) {
	colour = "black";
	name = "&#9819;"; //"Q";
    } else if (piece == piece_bk) {
	colour = "black";
	name = "&#9818;";
    } else if (piece == piece_bp) {
	colour = "black";
	name = "&#9823;";
    } else if (piece == piece_wr) {
	colour = "white";
	name = "&#9814;";
    } else if (piece == piece_wn) {
	colour = "white";
	name = "&#9816;";
    } else if (piece == piece_wb) {
	colour = "white";
	name = "&#9815;";
    } else if (piece == piece_wq) {
	colour = "white";
	name = "&#9813;";
    } else if (piece == piece_wk) {
	colour = "white";
	name = "&#9812;";
    } else if (piece == piece_wp) {
	colour = "white";
	name = "&#9817;";
    }
    var background = '#d48b84';
    if (isBlackBackground) {
	background = '#af5348';
    }
    return render_html(background, colour, name);
}

function render_piece_unicode(isBlackBackground, piece) {
    debug('???? ' + piece);
    var colour = "?";
    var name = "?";
    if (piece == -1) {
	colour = "white";
	name = "&nbsp;";
    } else if (piece == piece_br) {
	colour = "black";
	name = "&#9820;"; //"R";
    } else if (piece == piece_bn) {
	colour = "black";
	name = "&#9822;"; //"N";
    } else if (piece == piece_bb) {
	colour = "black";
	name = "&#9821;"; //"B";
    } else if (piece == piece_bq) {
	colour = "black";
	name = "&#9819;"; //"Q";
    } else if (piece == piece_bk) {
	colour = "black";
	name = "&#9818;";
    } else if (piece == piece_bp) {
	colour = "black";
	name = "&#9823;";
    } else if (piece == piece_wr) {
	colour = "white";
	name = "&#9814;";
    } else if (piece == piece_wn) {
	colour = "white";
	name = "&#9816;";
    } else if (piece == piece_wb) {
	colour = "white";
	name = "&#9815;";
    } else if (piece == piece_wq) {
	colour = "white";
	name = "&#9813;";
    } else if (piece == piece_wk) {
	colour = "white";
	name = "&#9812;";
    } else if (piece == piece_wp) {
	colour = "white";
	name = "&#9817;";
    }
    var background = '#d48b84';
    if (isBlackBackground) {
	background = '#af5348';
    }
    return render_html_td(background, colour, name);
}


function draw_html() {
    var html = "<div style='margin: 30px;'>";

    isBlackBackground = 1;
    for (var y = 0; y < 8; y++) {
	//html += '-----------------<br>';
	//html += '|';
	for (var x = 0; x < 8; x++) {
	    // Remember, this is the _other_ player's view of the board,
	    // so we actually need to flip it around again.
	    var column = 7 - screenXY(x);
	    var row = 7 - screenXY(y);
	    html += render_piece(isBlackBackground, positions[column][row]); // + '|';
	    isBlackBackground = !isBlackBackground;
	}
	isBlackBackground = !isBlackBackground;
	html += '<br>';
    }
    //html += '-----------------<br>';

    html += '</div>';

    debug(html);
    return html;
}

function draw_html_table() {
    var html = "<p><table border=0>";

    isBlackBackground = 1;
    for (var y = 0; y < 8; y++) {
	//html += '-----------------<br>';
	//html += '|';
	html += '<tr valign="center">';
	for (var x = 0; x < 8; x++) {
	    // Remember, this is the _other_ player's view of the board,
	    // so we actually need to flip it around again.
	    var column = 7 - screenXY(x);
	    var row = 7 - screenXY(y);
	    html += render_piece_unicode(isBlackBackground, positions[column][row]); // + '|';
	    isBlackBackground = !isBlackBackground;
	}
	isBlackBackground = !isBlackBackground;
	html += '</tr>';
    }
    //html += '-----------------<br>';

    html += '</table>';

    debug(html);
    return html;
}
function move_is_valid(board, fromX, fromY, toX, toY, checkcheck) {
   var p = board[fromX][fromY];
   if (!isPiece(p)) {
      return "No piece";
   }

   var colour = getColour(p);

   var pTo = board[toX][toY];

   if (isPiece(pTo) && getColour(pTo) == colour) {
      return "restart";
   }

   // Okay! Get piece type, then...
   var type = getPieceType(p);

   if (type == "queen") {
      return freedomHorizontalDiagonal(board, fromX, fromY, toX, toY);
   } else if (type == "knight") {
      return freedomKnight(board, fromX, fromY, toX, toY);
   } else if (type == "rook") {
      return freedomHorizontal(board, fromX, fromY, toX, toY, 8);
   } else if (type == "bishop") {
      return freedomDiagonal(board, fromX, fromY, toX, toY, 8);
   } else if (type == "king") {
      // TODO! Kings have special freedoms
      // And can affect other pieces, a little awkwardly (but, not too bad actually).
      return freedomKing(board, fromX, fromY, toX, toY);
   } else if (type == "pawn") {
      //debug("Checking pawn");
      return freedomPawn(board, fromX, fromY, toX, toY, colour);
   }
}

function get_next_player() {
   if (player == 'None' || player == 'white')
      return 'black';
   else return 'white';
}

function get_player() {
   if (player == 'None')
      return 'white';
   return player;
}

function freedomKing(board, fromX, fromY, toX, toY) {
   if (fromY == toY && fromX == 4 && (toX == 6 || toX == 2) && (fromY == 0 || fromY == 7)) {
       // need to check if already moved, took until 2018 for this bug to be noticed!
       if ((isWhite(positions[fromX][fromY]) && hasWhiteKingMoved == "true")
	   || (isBlack(positions[fromX][fromY]) && hasBlackKingMoved == "true")) {
	   return "castle_already_moved";
       }
       
      if (isOpponentOpponentCheck(board) == "true") {
         return "castle_in_check";
      } else {
         return "true";
      }
   } else {
      if (Math.abs(fromX - toX) <= 1 && Math.abs(fromY - toY) <= 1 &&
         (fromX != toX || fromY != toY))
         return "true";

   }
   return "false";
}

function hasQueened(board, fromX, fromY, toX, toY) {
   var piece = board[fromX][fromY];
   var type = getPieceType(piece);
   var colour = getColour(piece);

   if (type == "pawn" && (
         (colour == "white" && fromY == 1 && toY == 0) ||
         (colour == "black" && fromY == 6 && toY == 7)
      )) {
      return "true";
   }

   return "false";
}

// FIXME This is poorly named. It should be, isabouttocastle.
// 20181125: But do we check whether the king has moved and moved back again?
//           Just add a global in here..?
function hasCastled(board, fromX, fromY, toX, toY) {
   var piece = board[fromX][fromY];
   var type = getPieceType(piece);

   if (type == "king" && (fromX - 1 != toX && fromX + 1 != toX && fromY == toY))
      return "true";
   else
      return "false";
}

function hasDoneCastled(board, fromX, fromY, toX, toY) {
   var piece = board[toX][toY];
   var type = getPieceType(piece);

   if (type == "king" && (fromX - 1 != toX && fromX + 1 != toX && fromY == toY))
      return "true";
   else
      return "false";
}

function freedomHorizontal(board, fromX, fromY, toX, toY, steps) {
   // First, which direction are we to travel in? Four cases:
   var deltaX = 0,
      deltaY = 0;

   if (fromX < toX && fromY == toY) {
      // Travel to the right
      deltaX = 1;
   } else if (fromX > toX && fromY == toY) {
      // Travel to the left
      deltaX = -1;
   } else if (fromX == toX && fromY < toY) {
      // Travel down
      deltaY = 1;
   } else if (fromX == toX && fromY > toY) {
      // Travel up
      deltaY = -1;
   } else {
      return "false";
   }

   // Now, we've set the adders, so make the move...
   return freedomUnlimitedSteps(board, fromX, fromY, toX, toY, deltaX, deltaY, steps);
}

function freedomHorizontalDiagonal(board, fromX, fromY, toX, toY) {
   var error = freedomHorizontal(board, fromX, fromY, toX, toY, 8);
   if (error == "true")
      return "true";
   var error2 = freedomDiagonal(board, fromX, fromY, toX, toY, 8);
   if (error2 == "true")
      return "true";
   return error + ", " + error2;
}

function freedomPawn(board, fromX, fromY, toX, toY, colour) {
   // First, special en passant check
   if (pawnJumpX > -1 && pawnJumpY > -1) {
      if (toX == pawnJumpX && (
            toY == 2 && pawnJumpY == 3 ||
            toY == 5 && pawnJumpY == 4)) {
         return "enpassant";
      }
   }

   // Normal check
   var direction = 1;
   var baseRow = 1;
   if (colour == "white") {
      direction = -1;
      baseRow = 6;
   }

   // first, diagonals
   var p = board[toX][toY];

   if (isPiece(p)) {
      if ((fromX + 1 == toX && fromY + 1 * direction == toY) |
         (fromX - 1 == toX && fromY + 1 * direction == toY)) {
         return "true";
      } else {
         return "You can only take on the diagonal";
      }
   }

   // So, move forward.
   if (fromY + direction == toY && fromX == toX) {
      return "true";
   } else if (fromY == baseRow && fromY + direction * 2 == toY && fromX == toX) {
       // but need to check that there isn't a piece in the intermediate square!
       if (board[toX][fromY + direction] == -1) {
	   return "true";
       }
   }

   return "Unreachable";
}


function freedomDiagonal(board, fromX, fromY, toX, toY, steps) {
   // First, which direction are we to travel in? Four cases:
   var deltaX = 0,
      deltaY = 0;

   if (fromX < toX && fromY < toY) {
      // Travel to the right, down
      deltaX = 1;
      deltaY = 1;
   } else if (fromX < toX && fromY > toY) {
      // Travel to the right, up
      deltaX = 1;
      deltaY = -1;
   } else if (fromX > toX && fromY < toY) {
      // Travel left, down
      deltaX = -1;
      deltaY = 1;
   } else if (fromX > toX && fromY > toY) {
      // Travel left, up
      deltaX = -1;
      deltaY = -1;
   } else {
      return "false";
   }

   // Now, we've set the adders, so make the move...
   return freedomUnlimitedSteps(board, fromX, fromY, toX, toY, deltaX, deltaY, steps);
}


/*
  Special case, four to check. Eight to check that is.
  Two across one way, one across another. 
*/
function freedomKnight(board, fromX, fromY, toX, toY) {
   if ((fromX + 2 == toX && fromY + 1 == toY) ||
      (fromX + 2 == toX && fromY - 1 == toY) ||
      (fromX - 2 == toX && fromY + 1 == toY) ||
      (fromX - 2 == toX && fromY - 1 == toY) ||

      (fromX + 1 == toX && fromY + 2 == toY) ||
      (fromX - 1 == toX && fromY + 2 == toY) ||
      (fromX + 1 == toX && fromY - 2 == toY) ||
      (fromX - 1 == toX && fromY - 2 == toY)
   ) {
      return "true";
   } else return "Unreachable";
}

function freedomUnlimitedSteps(board, fromX, fromY, toX, toY, deltaX, deltaY, steps) {
   var x = fromX,
      y = fromY;
   for (var i = 0; i < steps; i++) {
      x = x + deltaX;
      y = y + deltaY;

      if (x < 0 || x > 7 || y < 0 || y > 7) {
         return "Unreachable";
      }

      if (x == toX && y == toY) {
         return "true";
      } else {
         if (x != toX || y != toY) {
            var p = board[x][y];
            if (isPiece(p)) {
               return "There is a piece in the way";
            }
         }
      }
   }

   return "Unreachable";
}

function isOpponentCheckMate(board) {

   if (isOpponentCheck(board) == "false")
      return "false";

   // Now, go through all of the opponent's pieces...
   for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
         var piece = board[x][y];
         if (piece > -1 && getColour(piece) == get_next_player()) {
            // So for each piece the question is, try each poss
            // move, and see if we can find one that doesn't
            // leave us in check.
            var moveC = checkMateMoveCheck(board, x, y, get_next_player());

            if (moveC == "true") {
               return "false";
            }
         }
      }
   }
   return "true";
}


function isPlayerCheckMate(board) {
   if (isPlayerCheck(board) == "false")
      return "false";

   // Now, go through all of the opponent's pieces...
   for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
         var piece = board[x][y];
         if (piece > -1 && getColour(piece) == get_player()) {
            var moveC = checkMateMoveCheck(board, x, y, get_player());
            if (moveC == "true") {
               return "false";
            }
         }
      }
   }

   return "true";
}

function checkMateMoveCheck(board, x, y, colour) {
   for (var toX = 0; toX < 8; toX++) {
      for (var toY = 0; toY < 8; toY++) {
         // Is this a legal move?
         var legalMove = move_is_valid(board, x, y, toX, toY, 0);

         if (legalMove == "true" || legalMove == "enpassant") {
            // Okay, copy the board, then apply the move, then go
            // NOTE: for the moment do something simple here?
            // I don't think it's possible to castle your way from
            // check. 
            var newBoard = copyBoard(board);

            // apply move
            newBoard[toX][toY] = newBoard[x][y];
            newBoard[x][y] = -1;

            // en passant, additional take
            if (legalMove == "enpassant") {
               newBoard[pawnJumpX][pawnJumpY] == -1;
            }

            // Now check if we are in check?
            var stillCheck = isCheck(newBoard, colour);

            if (stillCheck != "true") {
               debug("Escape by moving " + x + ", " + y + " to " + toX + ", " + toY);
               return "true";
            }
         }
      }
   }

   return "false";
}


function copyBoard(board) {
   var newBoard = new Array();
   for (var i = 0; i < 8; i++) {
      newBoard[i] = new Array();
   }

   for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
         newBoard[i][j] = board[i][j];
      }
   }

   return newBoard;
}

function isPlayerCheck(board) {
   return isCheck(board, get_player());
}

function isOpponentCheck(board) {
   return isCheck(board, get_next_player());
}

function isOpponentOpponentCheck(board) {
   return isCheck(board, get_player());
}

function isMoveEnPassant(board, fromX, fromY, toX, toY) {
   var p = board[fromX][fromY];
   if (p == -1)
      return false;
   if (getPieceType(p) != "pawn")
      return false;
   // Use a proxy here. We've moved diagonally, but in the
   // place we've moved to, there's no piece.
   if (fromX != toX && board[toX][toY] == -1)
      return true;
   return false;
}

function wasMoveEnPassant(board, fromX, fromY, toX, toY) {
   var p = board[toX][toY];
   if (p == -1)
      return false;
   if (getPieceType(p) != "pawn")
      return false;
   // Use a proxy here. We've moved diagonally, but in the
   // place we've moved to, there's no piece.
   if (fromX != toX && board[toX][toY] == -1)
      return true;
   return false;
}

function isCheck(board, colour) {

   // First, find the king!
   var kingX = -1,
      kingY = -1;

   for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
         var piece = board[x][y];
         if (getPieceType(piece) == "king" && getColour(piece) == colour) {
            kingX = x;
            kingY = y;
         }
      }
   }

   for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
         var piece = board[x][y];
         if (piece > -1 && getColour(piece) != colour) {
            if (move_is_valid(board, x, y, kingX, kingY, 0) == "true") {
               return "true";
            }
         }
      }
   }

   return "false";
}
