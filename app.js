// helpers

function getRnd(value, isWithData = true) {
    if(Array.isArray(value)) {
        const rndNumber = Math.floor(Math.random() * value.length)

        if(isWithData) {
            return value[rndNumber].dataset.parking
        } else {
            return value[rndNumber]
        }
    }

    return value
}

function getRndNumber(number) {
    return Math.floor(Math.random() * number)
}

function transformStrToArr(str) {
    return str.split(' ')
}

function addListener(elem, eventName, fn) {
    let node

    if(typeof elem === 'string') {
        node = document.querySelector(elem)
        node.addEventListener(eventName, fn)

        return
    }

    node = elem

    node.addEventListener(eventName, fn)
}

class TypeAuto {
    static type = ''
}

class Filter {
    constructor(parkingAreas) {
        this.parkingAreas = parkingAreas

        this.init()
    }

    isNodeEmpty(value, place) {
        if(!value.textContent) {
            value.textContent = `Занято ${place}`
            return false
        }
        return true
    }

    getNodeWithoutText(arr) {
        let node
        let isFinded = false

        arr.some(item => {
            if(!item.textContent && !isFinded) {
                node = item
                isFinite = true
                return
            }
        })

        return node
    }

    addCarToParking(field) {
        debugger
        if(field === 'disabled' && !this.parkingPlace[field] 
        && !this.parkingPlace['car']) {
            alert('Инвалид Ухади')
            return
        }

        if(!this.parkingPlace[field]) {
            alert('Выбачте Нема Мест')
            return
        }

        if(field === 'disabled') {
            const rnd = getRndNumber(20)
            let fieldText = field

            if(this.parkingPlace[field]) {
                const place = rnd > 12 ? 'car' : 'disabled'
                field = place
            } else {
                field = 'car'
            }

            const filteredPlaces = this.parkingAreas.filter(item => item.dataset.parking.includes(field))
            const rndItem = getRnd(filteredPlaces, false)

            this.isNodeEmpty(rndItem, fieldText) ? this.isNodeEmpty(this.getNodeWithoutText(filteredPlaces), fieldText) : this.isNodeEmpty(rndItem, fieldText)
        } else {
            const filteredPlaces = this.parkingAreas.filter(item => item.dataset.parking.includes(field))
            const rndItem = getRnd(filteredPlaces, false)

            this.isNodeEmpty(rndItem, field) ? this.isNodeEmpty(this.getNodeWithoutText(filteredPlaces), field) : this.isNodeEmpty(rndItem, field)
        }

        this.parkingPlace[field]-= 1
    }

    calculateParkingEqualPlace(items) {
        this.parkingPlace = {
            car: 0,
            truck: 0,
            disabled: 0
        }

        items.forEach(item => {
            const value = item.dataset.parking

            if(transformStrToArr(value).length > 1) {
                const takeFirstValue = transformStrToArr(value)[0]
                this.parkingPlace[takeFirstValue]+= 1
                return
            }

            this.parkingPlace[value]+= 1
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

    render() {
        if(!this.isFirstInit) {
            this.addCarToParking(TypeAuto.type)
        }

        this.isFirstInit = false
        console.log(this)
    }
}

const parkingZone = new Parking('.parking__item')

parkingZone.render()

addListener('.js-parking-input', 'input', (e) => {
    TypeAuto.type = e.target.value
})

addListener('.js-parking-add', 'click', () => {
    if(TypeAuto.type.length >= 3) {
        parkingZone.render()
    }
})

