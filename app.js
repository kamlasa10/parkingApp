// helpers

function getRnd(arr, isWithData = true) {
    if (Array.isArray(arr)) {
        const rndNumber = Math.floor(Math.random() * arr.length)

        if (isWithData) {
            return arr[rndNumber].dataset.parking
        } else {
            return arr[rndNumber]
        }
    }

    return arr
}

function $(selector) {
    return typeof selector === 'string' ? document.querySelector(selector) : selector
}

function getRndNumber(number) {
    return Math.floor(Math.random() * number)
}

function transformStrToArr(str) {
    return str.split(' ')
}

function addListener(elem, eventName, fn) {
    let node

    if (typeof elem === 'string') {
        node = document.querySelector(elem)
        node.addEventListener(eventName, fn)

        return
    }

    node = elem

    node.addEventListener(eventName, fn)
}

class Filter {
    constructor(parkingAreas) {
        this.parkingAreas = parkingAreas

        this.init()
    }

    addTextToParkingPlace(node, place) {
        node.textContent = `Занято ${place}`
    }

    getRndNodeWithoutText(arr) {
        const arrNodes = []

        arr.some(item => {
            if (!item.textContent) {
                arrNodes.push(item)
            }
        })

        return getRnd(arrNodes, false)
    }

    filterArrByField(field, arr, fieldText) {
        const filteredPlaces = arr.filter(item => item.dataset.parking.includes(field))
        const node = this.getRndNodeWithoutText(filteredPlaces)
        console.log(node)
        this.addTextToParkingPlace(node, fieldText)
    }

    isHasPlaceByField(field) {
        if (!this.parkingPlace[field] && field !== 'disabled') {
            alert('Выбачте нема мест')
            return
        } else if (field === 'disabled' && (!this.parkingPlace[field] && !this.parkingPlace['car'])) {
            alert('Инвалидам здесь не место')
            return
        }
    }

    addCarToParking(field) {
        this.isHasPlaceByField(field)

        if (field === 'disabled') {
            const rnd = getRndNumber(20)
            let fieldText = field

            if (this.parkingPlace[field]) {
                const place = rnd > 12 && this.parkingPlace['car'] ? 'car' : 'disabled'
                field = place
            } else {
                field = 'car'
            }

            this.filterArrByField(field, this.parkingAreas, fieldText)
        } else {
            this.filterArrByField(field, this.parkingAreas, field)
        }

        this.parkingPlace[field] -= 1
    }

    calculateParkingEqualPlace(items) {
        this.parkingPlace = {
            car: 0,
            truck: 0,
            disabled: 0
        }

        items.forEach(item => {
            const value = item.dataset.parking

            if (transformStrToArr(value).length > 1) {
                const takeFirstValue = transformStrToArr(value)[0]
                this.parkingPlace[takeFirstValue] += 1
                return
            }

            this.parkingPlace[value] += 1
        })
    }

    init() {
        this.calculateParkingEqualPlace(this.parkingAreas)
    }
}

class Parking extends Filter {
    constructor(selectorParkingAreas) {
        super(
            Array.from(document.querySelectorAll(selectorParkingAreas))
        )

        this.parkingAreas = Array.from(document.querySelectorAll(selectorParkingAreas))
        this.isFirstInit = true
    }

    notifyUser(objWithParking) {
        return Object.entries(objWithParking).reduce((acc, [key, value]) => {
            if(value < 0) {
                acc+= `${key}: ${Math.abs(value)} Не запаркованны `
            }

            return acc
        }, '')
    }

    render(data = {}) {
        const msgObj = {}
        Object.entries(data).forEach(([key, value]) => {
            msgObj[key] = this.parkingPlace[key] - value

            for(let i = value; i; i--) {
                if(this.parkingPlace[key]) {
                    this.addCarToParking(key)
                    continue
                }
            }
        })

        const msg = this.notifyUser(msgObj)

        if(msg.length) {    
            alert(msg)
        }
    }
}

const parkingZone = new Parking('.parking__item')

addListener('.js-parking-add', 'click', () => {
    const infoParkingPlace = {
        car: +$('.js-parking-car').value,
        truck: +$('.js-parking-truck').value,
        disabled: +$('.js-parking-disabled').value
    }

    parkingZone.render({
        car: +$('.js-parking-car').value,
        truck: +$('.js-parking-truck').value,
        disabled: +$('.js-parking-disabled').value
    })

    $('.js-parking-car').value = ''
    $('.js-parking-truck').value = ''
    $('.js-parking-disabled').value = ''
})

const classNames = [
    'header', 'menu', 'menu-item', 'menu-item', 'menu-item',
    'footer', 'menu', 'link', 'link', 'link', 'link'
]

function transformArrToObj(arr) {
    return arr.reduce((acc, next) => {
        if (!acc[next]) {
            acc[next] = 1
            return acc
        }

        acc[next] += 1
        return acc
    }, {})
}

function getSortedArr(obj) {
    return Object.keys(obj).sort((a, b) => obj[a] - obj[b]).reverse()
}

console.log(getSortedArr(transformArrToObj(classNames)))