---
title: Asynchronously Loading Images into Table and Collection Views
slug: 3105eb5b-a42c-add3-3945-a851d42a978c
published: true
---

이미지를 비동기적으로 저장하고 가져옴으로써 당신의 앱을 더 반응성 있게 만든다. (?)
이미지를 캐싱하면 테이블과 컬렉션 뷰를 빠르게 인스턴스화하고 빠른 스크롤에 반응할 수 있다.

* 왜 저기서 메인 큐에 대해서 가져가야할까..

* `@escaping` 클로저 이기 때문에 다른 스레드에서 실행될 수 있다는 근거...가...

* `@escaping` 함수가 종료되고 나서도 실행될 수 있는 클로저로 알고 있고...

* 굳이 스위프트에서 @escaping 클로저랑 아닌 클로저를 왜 굳이 나눠야 했을까?
  
  * 캡처라는 특성을 가지는 클로저
  * 클로저 자신이 실행될 때 자신 안에 들어 있는 레퍼런스들을 보존하기 위해서
  * 클로저가 미래에 어느 시점에 실행이 될텐테 클로저 안에 있는 인스턴스들은 계속 살려둬야 하기 때문에 레퍼런스 카운트를 관리하기 위해서..
  * 내가 이 순간에 끝날 클로저다 (비탈출 클로저)
  * 명시하는 이유
    * 클로저의 캡처라는 특성 때문에
    * 클로저 내의 레퍼런스의 참조 카운트를 관리하기 위한 힌트
  * 언제까지 살려둬야 하는 힌트가 없으면 컴파일 에러가 난다..

 > 
 > 개 어 려 워

* 테이블뷰를 스크롤해버리면 어떤 일이 발생함?
  * 셀은 재사용되기 때문에
  * 이미 이 셀은 큐에 들어가있거나 다른곳에서 ㅅ재사용되고 있을 수 있음
  * 지금 시점에 이 친구의 이미지와 request를 요청할 때의 이미지를 비교
    * `img != fetchedItem.image`
* 다른 스레드에서 실행될 가능성을 염두해두고, UI 를 업데이트하는 코드를 main thread에 태운다.,.,
* 

````swift
/// - Tag: cache
// Returns the cached image if available, otherwise asynchronously loads and caches it.
// 캐싱된 이미지를 이용할 수 있으면 리턴하고, 그렇지 않으면 비동기적으로 이미지를 가져오고 캐싱한다.
// @escaping 을 쓰는 이유? : 원본 영역 내에서 벗어난 경우에 사용해야 함 (DispatchQueue.main.async)
// 메서드가 끝난 후에도 계속해서 작업을 해야 하는 경우(이미지가 아주 큰 경우)에 언제 값이 반환될 지 모른다. 해당 키워드를 사용함으로써 메서드를 호출하는 바깥쪽에서 이 메서드의 반환을 기다리지 않는다.
// 옵셔널 클로저는 기본 값이 @escaping
final func load(url: NSURL, item: Item, completion: @escaping (Item, UIImage?) -> Swift.Void) {
    // Check for a cached image.
    // 캐시된 이미지가 있는 지 확인한다.
    if let cachedImage = image(url: url) {
        DispatchQueue.main.async {
            completion(item, cachedImage)
        }
        return
    }
    // In case there are more than one requestor for the image, we append their completion block.
    // 이미지에 대한 리퀘스트가 둘 이상인 경우 completion block을 추가한다.
    if loadingResponses[url] != nil {
        loadingResponses[url]?.append(completion)
        return
    } else {
        loadingResponses[url] = [completion]
    }
    // Go fetch the image.
    // 이미지를 가져온다.
    ImageURLProtocol.urlSession().dataTask(with: url as URL) { (data, response, error) in
        // Check for the error, then data and try to create the image.
        // 에러와 데이터를 확인하고, 이미지 생성을 시도한다.
        guard let responseData = data, let image = UIImage(data: responseData),
            let blocks = self.loadingResponses[url], error == nil else {
            DispatchQueue.main.async {
                completion(item, nil)
            }
            return
        }
        // Cache the image.
        // 이미지를 캐싱한다.
        self.cachedImages.setObject(image, forKey: url, cost: responseData.count)
        // Iterate over each requestor for the image and pass it back.
        // 이미지에 대한 각 requestor를 반복하고 다시 전달한다.
        for block in blocks {
            DispatchQueue.main.async {
                block(item, image)
            }
            return
        }
    }.resume()
}
````

## 참고 자료

* [Asynchronously Loading Images into Table and Collection Views | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/views_and_controls/table_views/asynchronously_loading_images_into_table_and_collection_views)

## 태그

\#iOS/UITableView #iOS/UICollectionView #Swift/NSCache
