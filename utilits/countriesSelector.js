export const countriesSelector = (array, letter) => {
    let result = [];
    //Проверка приходящего массива на то, вызывается ли функция фронтом
    if(array===''){
        return result
    }
    let i = 0;

    //Бинарный поиск первоого слова на каждую букву
    const recursiveBinarySearch = (array, item, start, end) => {
        let middle = Math.floor((start + end) / 2);
        if (item === array[middle][0] && middle === 0) {
            return middle
        }
        if (item === array[middle][0] && item > array[middle-1][0]) {
            return middle
        }
        if( end - start === 0){
            return array.length;
        }
        if (item < array[middle]) {
            return recursiveBinarySearch(array, item, start, middle - 1 )
        } else {
            return recursiveBinarySearch(array, item, middle + 1, end )
        }
    }
    i = recursiveBinarySearch(array, letter, 0, array.length);
    //Добавление в мссив всех слов на заданную букву
    if (i !== array.length) {
        let current = array[i][0];
        while (current === letter && i < array.length) {
            result.push(array[i]);
            i++;
            if (i < array.length) {
                current = array[i][0];
            }
        }
    }
    return result;
}