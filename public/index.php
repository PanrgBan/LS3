<?php 
session_start();
include "/lang.php";
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>WatherMark | Team №1</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="styles/style.css"><!--[if lt IE 9]>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script><![endif]-->
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="main">
          <h1 class="h1"><?php echo t("title"); ?></h1>
          <div class="work-area">
            <div class="img-area"><img id="img" src="/images/123.jpg"><img id="wm" src="/images/log.jpg" class="wm"></div>
          </div>
        </div>
        <div class="side-panel">
          <h2 class="h2"><?php echo t("setting"); ?></h2>
          <div class="panel-wrap">
            <div class="upload">
              <form method="post">
                <div class="upload__pic">
                  <label class="small-title upload-name"><?php echo t("stock-img"); ?></label>
                  <div class="form-group">
                    <div class="upload-wrapper"><?php echo t("download-img"); ?></div>
                    <div class="upload-btn">
                      <div class="ico_download"></div>
                    </div>
                    <input type="file" name="userfile" class="fileupload">
                  </div>
                </div>
                <div class="upload__pic disabled">
                  <label class="small-title upload-name"><?php echo t("watermark"); ?></label>
                  <div class="form-group">
                    <div class="upload-wrapper"><?php echo t("download-img"); ?></div>
                    <div class="upload-btn">
                      <div class="ico_download"></div>
                    </div>
                    <input type="file" name="userfile2" class="fileupload disabled-input">
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="panel-wrap top-line">
            <div class="head">
              <div class="small-title"><?php echo t("position"); ?></div>
              <div class="control"><a href="#" class="four"></a><a href="#" class="one active"></a></div>
            </div>
            <div class="move-wrap">
              <div class="move-field-wr">
                <table class="move-field">
                  <tbody>
                    <tr>
                      <td data-x="0" data-y="0" class="active"></td>
                      <td data-x="1" data-y="0"></td>
                      <td data-x="2" data-y="0"></td>
                    </tr>
                    <tr>
                      <td data-x="0" data-y="1"></td>
                      <td data-x="1" data-y="1"></td>
                      <td data-x="2" data-y="1"></td>
                    </tr>
                    <tr>
                      <td data-x="0" data-y="2"></td>
                      <td data-x="1" data-y="2"></td>
                      <td data-x="2" data-y="2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="move-spinner">
                <div class="pos-x">
                  <label>X</label>
                  <div id="board-x" class="spinner">0</div>
                  <div class="spinner-group"><a href="#q" data-direction="right" class="ico-in_arrow-up"></a><a href="#q" data-direction="left" class="ico-in_arrow-down"></a></div>
                </div>
                <div class="pos-y">
                  <label>Y</label>
                  <div id="board-y" class="spinner">0</div>
                  <div class="spinner-group"><a href="#q" data-direction="bottom" class="ico-in_arrow-up"></a><a href="#q" data-direction="top" class="ico-in_arrow-down"></a></div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-wrap top-line">
            <div class="small-title"><?php echo t("opacity"); ?></div>
            <div class="range-controls">
              <div class="scale">
                <div class="bar"></div>
                <div class="toggle"></div>
              </div>
            </div>
          </div>
          <div class="panel-wrap top-line">
            <form method="post" class="send">
              <button class="btn btn-reset"><?php echo t("reset"); ?></button>
              <button class="btn btn-download"><?php echo t("download"); ?></button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <footer class="l-footer">
      <footer class="footer">
        <p class="copy">© 2014, <?php echo t("copyright"); ?></p>
      </footer>
    </footer>
    <div class="soc-lang-panel">
      <ul class="language-panel">
        <li><a <?php echo (!$_SESSION["lang-eng"]) ? 'class="active"' : '';?> href="/lang.php?lang=rus">РУС</a></li>
        <li><a <?php echo ($_SESSION["lang-eng"]) ? 'class="active"' : '';?> href="/lang.php?lang=eng">ENG</a></li>
      </ul>
      <ul class="social-panel">
        <li class="control ico_like"></li>
        <li data-yashareLink="http://pangur.bget.ru/" data-yashareType="none" data-yashareQuickServices="facebook" class="ico_fb yashare-auto-init"></li>
        <li data-yashareLink="http://pangur.bget.ru/" data-yashareType="none" data-yashareQuickServices="twitter" class="ico_tw yashare-auto-init"></li>
        <li data-yashareLink="http://pangur.bget.ru/" data-yashareType="none" data-yashareQuickServices="vkontakte" class="ico_vk yashare-auto-init"></li>
      </ul>
    </div>
    <script src="http://yastatic.net/jquery/1.11.1/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="scripts/vendor/jquery-1.11.1.min.js"><\/script>')</script>
    <script src="scripts/vendor/jquery.ui.widget.js"></script>
    <script src="scripts/vendor/jquery-ui.drag.min.js"></script>
    <script src="scripts/vendor/jquery.iframe-transport.js"></script>
    <script src="scripts/vendor/jquery.fileupload.js"></script>
    <script src="http://yastatic.net/share/share.js"></script>
    <script src="scripts/app.js"></script>
  </body>
</html>