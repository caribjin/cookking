COOKKING
===================
**COOKKING**은 node.js 기반의 full-stack framework인 [Meteor.js](https://www.meteor.com/)로 만들어진 mobile hybrid app입니다.

데모
-------------
> [<i class="icon-download"></i>DOWNLOAD](https://dl.dropboxusercontent.com/u/4379311/production.apk)

> 위의 apk 파일을 다운로드 받아, 모바일기기에 직접 copy한 후 수동 설치하시면 됩니다. 바이러스 이런건 없으니 안심하시기 바랍니다.

기능
-------------
 - 폼 로그인/가입
 - TWITTER 로그인
 - 레시피 조회. (시간순/좋아요순/북마크순 정렬)
 - 레시피 종류별 필터링
 - 레시피 생성/수정/삭제
 - 공개/비공개 레시피
 - 오늘의 추천메뉴 
 - 재료 추가
 - 조리과정 및 사진 추가
 - 완료사진 추가
 - 댓글
 - 좋아요
 - 북마크
 - 레시피별 피드백 작성 
 - 북마크 목록
 - 피드백 목록
 - 프로필

설치
-------------
#### 소스코드 내려받기
###### **git client**
> **git clone** git@github.com:caribjin/cookking.git

###### **zip download**
> [<i class="icon-upload"></i>https://github.com/caribjin/cookking/archive/master.zip](https://github.com/caribjin/cookking/archive/master.zip)

디렉터리 구조
-------------
```
+-- cookking                        application root
	+-- app                         meteor root
		+-- .hooks  				git commit hook
		+-- both
		|   +-- collections			collections
		|   +-- controllers			iron-router controllers
		|   +-- lib					global helper utility
		|       router.js			router
		+-- client
		|   +-- collections         client collections
		|   +-- lib                 client library
		|   +-- stylesheets         stylesheet
		|   +-- views               view template
		|       app.html            
		|       app.js              global helper utility for client
		+-- packages
		+-- private
		+-- public                  public resources
		+-- resources               resources for mobile env
		+-- server
		|   +-- bootup              bootup actions
		|   +-- collections
		|   +-- handler             handlers
		|   +-- methods             server mothods
		|   +-- publish             publish
		|       mobile-config.js    mobile config setting
	+-- assets                      sample pictures for initial data
	+-- build                       build output root
	+-- config
		+-- development
		|   +-- env.sh              env shell script
		|   +-- settings.json       for meteor.settings
		+-- production
		|   +-- env.sh              env shell script
		|   +-- settings.json       for meteor.settings
		|   +-- mup.json            settings for mup
		    start                   utility for running meteor
```

Directory          | Description
------------------ | --------------
app                | Meteor의 root directory.<br>이 디렉토리에서 meteor 명령을 통해 직접 구동할도 있으나, application root(cookking)의 start shell을 통해 구동하는 것을 권장.
.hooks             | git commit handler를 포함한 디렉토리.<br>application root에서 git init 한 뒤 .hooks 폴더의 post-commit 파일을 .git 폴더 하위의 hooks 폴더에 copy하면 이후 commit 할때마다 최종 tag를 cookking의 버전번호로 사용.
assets             | 실제 앱 구동과는 무관한 폴더.<br>최초 구동 시 샘플데이터를 생성할 경우 샘플 사진이미지들이 위치. settings.json 파일의 app.generateFixtureData 설정값이 true일 경우에는 해당 위치에 이미지파일이 있어야 함.
build              | app을 build할 경우 사용되는 root 폴더<br>application root의 start shell script를 build 옵션으로 구동할 경우, 기본적으로 이 위치에 android, bundle 두 개의 폴더가 생성됨.
config             | app 구동 환경설정 root.<br>development환경과 production 환경 두 경우에 따라 각각 실행환경 변수와 어플리케이션 설정값을 다르게 적용. application root의 start shell script를 dev option 또는 prod option으로 구동하여 각각 적용.

SETTINGS.JSON
-------------------
```
{
    // client/server 공통 설정
	"public": {
		"menuOpenWipeDistance": 130,          // 메뉴 열림을 위한 손가락 쓸기 거리
		"shortDateDisplayDiff": 7,            // 날짜 표시를 짧게(몇정정 일전) 표시할 차이의 범위 
		"locale": "kr",                       // 기본 지역코드
		"ingredientsCountLimit": 20,          // 재료 추가가능 최대개수 (필수/선택 각각)
		"directionsCountLimit": 20,           // 조리법 추가가능 최대개수
		"emptyAvatarImage": "/img/profile/profile-empty.png",   // 빈 프로필 이미지

		"defaultCameraImageWidth": 1024,      // 사진촬영 이미지 기본 사이즈
		"defaultCameraImageHeight": 1024,
		"defaultCameraImageQuality": 90,

		"thumbnailImageWidth": 320,           // 피드 썸네일 이미지 크기
		"thumbnailImageHeight": 320,
		"thumbnailImageQuality": 80,

		"uploadMaxLimitSize": 10485760,       // 업로드 최대 제한 용량

		"uploadLimitExtensions": {            // 업로드 이미지 허용 확장자
			"images": ["jpg", "jpeg", "png", "gif"]
		},

		"defaultAnimationDurationFast": 100,  // 기본 애니메이션 속도 (ms)
		"defaultAnimationDuration": 200,
		"defaultAnimationDurationSlow": 500,
		"defaultAnimationDurationVerySlow": 800,

		"defaultNotificationTime": 5000,      // 기본 알림메시지 출력 시간
		"defaultRecipesListLimit": 10,        // 레시피 목록 최초 기본 개수
		"recipesLimitIncrementCount": 20,     // 레시피 목록 더 보기 시 증가 개수

        // 레시피 작성 시 기본 완료이미지
		"defaultRecipeWriteCompleteImage": "/img/app/bg-recipe-write.jpg",
		// 레시피 리스트 기본 정렬 기준 (created, favorited, bookmarked)
		"defaultRecipesSort": "created",
		"defaultRecipesListFilter": "all",    // 레시피 리스트 기본 필터

		"defaultStoreType": "filesystem",     // 기본 저장소 유형 (filesystem / s3)
		                                      // s3일 경우 s3 setting 정의 필요
		"ga": {                               // google analystics 설정
			"id": "UA-XXXXX-Y",
			"create": {
				"cookieDomain": "--cookie_domain--",
				"cookieName": "--cookie_name--",
				"cookieExpires": 3600
			}
		}
	},

    // server 전용 설정
	"app": {
	    // application root 디렉토리 경로 (meteor app 경로)
		"applicationRootDirectory": "/home/caribjin/meteor/cookking/app/",
		"sendSignupWelcomeEmail": false,      // 가입시 환영메일 발송 여부
		                                      // true일 경우 mailgun 설정 정의 필요
		"validateEmailAddress": false,        // 가입시 이메일주소 유효성 검증
		                                      // true일 경우 mailgun 설정 정의 필요                                      
		"generateFixtureData": false,         // 최초구동 시 샘플데이터 생성 여부
		// 기본 이미지파일 저장 경로 (ec2를 사용할 경우 기본적으로 /home/ubuntu/app-files)
		"defaultFileStoragePath": "/home/caribjin/app-files/"
	},

    // kadira 인증 설정
	"kadira": {
		"appId": "--appId--",
		"appSecret": "--appSecret--"
	},

    // mailgun 설정.
    // 가입환영메일 발송 및 계정(메일주소) 유효성 체크에 사용
	"mailgun": {
		"uri": "--uri--",
		"apikey": "--apikey--",
		"pubkey": "--pubkey--",
		"smtp_host": "--smtp_host--",
		"default_smtp_login": "--default_smtp_login--",
		"default_password": "--default_password--"
	},

    // 인증 외부서비스 설정. 현재는 twitter만 사용 가능.
	"authServices": {
		"facebook": {
			"service": "facebook",
			"appId": "--appId--",
			"secret": "--secret--"
		},
		"twitter": {
			"service": "twitter",
			"consumerKey": "NFDQXe7P29etHwMGtJgbbEk8T",
			"secret": "49InZjniVGm04A81A2XqlzJb4OcXjALfmzAArBsRXkzOn6FEXT"
		},
		"github": {
			"service": "github",
			"clientId": "--clientId--",
			"secret": "--secret--"
		},
		"google": {
			"service": "google",
			"clientId": "--clientId--",
			"secret": "--secret--"
		}
	},

    // s3 인증 설정.
	"s3": {
		"accessKeyId": "--accessKeyId--",
		"secretAccessKey": "--secretAccessKey--"
	}
}

```

실행
-------------
application root 에서 start shell script를 실행
> **./start**

> -h 옵션을 통해 자세한 세부 옵션을 확인할 수 있습니다.
**./start -h**

Option                          | Description
--------------------------------|--------------------
dev                             | 개발환경으로 구동.<br>`/config/development` 폴더의 환경변수로 시작되며, 기본적으로 http://localhost:3000으로 구동됨.<br>`./start`와 같이 옵션없이 실행할 경우 기본적으로 dev 옵션으로 실행됨. env.sh에 PORT값이 3000으로 설정되어 있으나, 개발환경에서는 PORT 설정은 무시됨.
prod                            | 운영환경으로 구동.<br>`/config/production` 폴더의 환경변수로 시작되며, 별도 도메인으로 호스팅중일 경우 env.sh의 `ROOT_URL`을 그에 맞게 변경. PORT 번호도 운영환경에 맞게 변경.
mobile `<mobile-server>`    | android-device 옵션으로 구동.<br>안드로이드 디바이스가 usb 연결로 있어야 함. 기본적으로 development 환경으로 구동되며, 따라서 /config/development/ 환경변수들이 적용됨. mobile-server가 입력되지 않을 경우 기본적으로 http://localhost:3000 로 연결되도록 구동되며, 외부 호스팅등을 통한 운영상태로 연결하여 테스팅이 필요할 경우 `mobile-server`에 해당 URL을 입력해야 함.<br>Ex) `./start mobile cookking.mydomain.com`
build `<server-url> <platform>`  | 어플리케이션의 모든 플랫폼을 빌드함.<br>`server-url`을 입력하지 않을 경우 기본적으로 http://localhost:3000으로 구동됨.mup을 통해 aws의 ec2로 배포하기 위서는 반드시 실제 ec2의 public-DNS 혹은 Route 53에서 연결한 Record name을 입력해 줘야함.<br>platform 입력값을 생략하면 기본적으로 web 플랫폼을 기준으로 빌드하며, mobile 플랫폼으로 빌드할 경우 `platform` 옵션에 `mobile`을 입력.<br>Ex) `./start build cookking.mydomain.com mobile`
genkey `<app-name>`  | keytool로 안드로이드 apk 배포를 위한 private key를 생성. 생성하고자 하는 apk의 app 이름을 `<app-name>`에 입력. Ex) `./start genkey cookking`<br>동일한 app-name으로 이미 private key를 생성한 적이 있다면 생성할 필요 없음.
apk `<app-name>`   | 안드로이드 배포를 위한 apk 파일을 생성.<br>미리 `build` 옵션을 통해 /app/build/android 폴더에 unaligned.apk 파일이 생성되어 있어야 함. 이 옵션을 통해 동일 위치에 sign된 production.apk가 생성됨.
mup `<option>`     | mup을 실행함. /config/production 폴더내에서 mup을 실행해도 되나, 디렉토리 이동의 번거로움 해소를 위해 start shell 내에서 mup을 그대로 실행시킬 수 있도록 옵션화됨.<br>build를 마쳤다면 `mup deploy` 명령으로 aws ec2로 배포한다. 이 때, /config/production/ 내의 mup.json 설정이 올바르게 되어 있어야 하며, settings.json은 production 폴더의 settings.json 파일을 공유함. 자세한 mup 설정은 [meteor-up](https://github.com/arunoda/meteor-up)을 참고.



스크린샷
-------------


<p>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-54-41.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-55-15.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-55-19.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-56-37.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-56-48.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-56-54.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-57-04.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-58-01.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-58-14.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-59-10.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-59-22.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-14-59-54.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-00-23.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-00-52.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-02-05.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-02-46.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-03-34.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-03-45.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-03-51.png" width=200 vspace=10>
<img src="https://dl.dropboxusercontent.com/u/4379311/cookking/Screenshot_2015-05-05-15-03-55.png" width=200 vspace=10>
</p>

LICENSE
-------------
The MIT License (MIT)

Copyright (c) 2015 Youngjin Lim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.