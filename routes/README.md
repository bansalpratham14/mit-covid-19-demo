<h3>Registeration POST format</h3>
<ul>
    <li>
        <b>Request:</b>
        <p>{
            "phone": "9918925427",
            "nameInput": "Satyam",
            "password": "1234",
            "userType": "patient",
            "verified": false
        }</p>
    </li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "Registration successful",
            "data": {
                "user_type": "patient",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRpZW50X2lkIjoiMiIsInBhdGllbnRfcGhvbmUiOiI5OTE4OTI1NDI3IiwicGF0aWVudF9hZ2UiOjAsInBhdGllbnRfd2VpZ2h0IjowLCJwYXRpZW50X2hlYXJ0X3JhdGUiOjAsInBhdGllbnRfdGVtcGVyYXR1cmUiOjAsInBhdGllbnRfbG9jYXRpb24iOiJOYW4iLCJwYXRpZW50X3BpbmNvZGUiOiJOYW4iLCJkb2IiOiIyMDIwLTEwLTI2VDE4OjMwOjAwLjAwMFoiLCJpYXQiOjE2MDM4MDQyNzF9.o1NxmSDS0pnMJEhDotNnFvAku_Fa2fn70IaaXfqOnRs"
            }
        }</p>
    </li>
</ul>

<h3>Login POST format</h3>
<ul>
    <li>
        <b>Request:</b>
        <p>{
        "phoneNumber":"9918925425",
        "password": "1234"
        }</p>
    </li>
    <li>
        <b>Response 1:</b>
        <p>{
            "status": "Login sucessfull",
            "data": {
                "user_info": {
                    "user_id": "3",
                    "user_phone": "9918925425",
                    "user_name": "Satyam",
                    "user_pass": "1234",
                    "user_type": "pharmacy",
                    "is_verified": false,
                    "created_at": "19:17:54.754557",
                    "created_on": "2020-10-26T18:30:00.000Z"
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMyIsInVzZXJfcGhvbmUiOiI5OTE4OTI1NDI1IiwidXNlcl9uYW1lIjoiU2F0eWFtIiwidXNlcl9wYXNzIjoiMTIzNCIsInVzZXJfdHlwZSI6InBoYXJtYWN5IiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJjcmVhdGVkX2F0IjoiMTk6MTc6NTQuNzU0NTU3IiwiY3JlYXRlZF9vbiI6IjIwMjAtMTAtMjZUMTg6MzA6MDAuMDAwWiIsImlhdCI6MTYwMzgwNjgyOH0.MBGOddXvLi90MzP78w-Rbs4v_kHFWDE_g6Pc4y0Er5E"
            }
        }</p>
    </li>
    <li>
        <b>Response 2:</b>
        <p>{
            "status": "Login failed",
            "data": {
                "response": "Wrong Details"
            }
        }</p>
    </li>
</ul>

<h3>Get user private data GET format</h3>
<ul>
    <li>http://localhost:5000/users/:id</li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "success",
            "data": {
                "user_info": {
                    "user_phone": "9918925425",
                    "user_name": "Satyam",
                    "user_type": "pharmacy",
                    "is_verified": false
                }
            }
        }</p>
    </li>
</ul>

<h3>Update patient details PUT format</h3>
<ul>
    <li>
        <b>Request:</b>
        <p>{
            "age": 20,
            "weight": 60,
            "heartRate": 70,
            "temperature": 70,
            "location": "allahabad",
            "pincode": "211008",
            "dob": "21-12-2020"
        }</p>
    </li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "Edit successfull",
            "data": {
                "user_info": {
                    "patient_id": "2",
                    "patient_phone": "9918925427",
                    "patient_age": 20,
                    "patient_weight": 60,
                    "patient_heart_rate": 70,
                    "patient_temperature": 70,
                    "patient_location": "allahabad",
                    "patient_pincode": "211008",
                    "dob": "2020-12-20T18:30:00.000Z"
                }
            }
        }</p>
    </li>
</ul>

<h3>Patient profile GET format</h3>
<ul>
    <li>>http://localhost:5000/patient/:id</li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "Success",
            "data": {
                "user_info": {
                    "user_id": "2",
                    "user_phone": "9918925427",
                    "user_name": "Satyam",
                    "user_type": "patient",
                    "is_verified": false,
                    "patient_age": 20,
                    "patient_weight": 60,
                    "patient_heart_rate": 70,
                    "patient_temperature": 70,
                    "patient_location": "allahabad",
                    "patient_pincode": "211008"
                }
            }
        }</p>
    </li>
</ul>

<h3>Update patient details PUT format</h3>
<ul>
    <li>
        <b>Request:</b>
        <p>{
            "pharmaType": "Store",
            "address": "allahabad",
            "pincode": "211008",
            "balance": 500,
            "orders": 50
        }</p>
    </li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "Edit successfull",
            "data": {
                "user_info": {
                    "pharma_id": "3",
                    "pharma_phone": "9918925425",
                    "pharma_type": "Store",
                    "pharma_address": "allahabad",
                    "pharma_pincode": "211008",
                    "balance": "500",
                    "orders": "50",
                    "created_on": "2020-10-26T18:30:00.000Z"
                }
            }
        }</p>
    </li>
</ul>

<h3>Pharmacy profile GET format</h3>
<ul>
    <li>>http://localhost:5000/pharmacy/:id</li>
    <li>
        <b>Response:</b>
        <p>{
            "status": "Success",
            "data": {
                "user_info": {
                    "user_id": "3",
                    "user_name": "Satyam",
                    "user_phone": "9918925425",
                    "user_type": "pharmacy",
                    "is_verified": false,
                    "pharma_type": "Store",
                    "pharma_address": "allahabad",
                    "pharma_pincode": "211008",
                    "balance": "500",
                    "orders": "50"
                }
            }
        }</p>
    </li>
</ul>

## Doctor

### Get Doctor Details

URL

https://localhost:5000/doctor/1

Response

```json
{
    "status": "Success",
    "data": {
        "user_info": {
            "user_id": "1",
            "user_phone": "9918925425",
            "user_name": "Satyam",
            "user_type": "doctor",
            "is_verified": false,
            "doctor_expi": 11,
            "doctor_dep": "Paediatrics",
            "doctor_aos": "Paediatrics",
            "doctor_qual": "PhD",
            "doctor_pincode": "5231GGG"
        }
    }
}
```

### Update Doctor Details

URL

https://localhost:5000/doctor/1/edit

```json
{
    "doctorExpi": 12,
    "doctorDep": "Veterinary",
    "doctorAos": "Zoology",
    "doctorQual": "PhD",
    "doctorAddress": "Kwa-Zulu Natal",
    "doctorPincode": "213123"
}
```

Response

```json
{
    "status": "Success",
    "data": {
        "user_info": {
            "user_id": "1",
            "user_phone": "9918925425",
            "user_name": "Satyam",
            "user_type": "doctor",
            "is_verified": false,
            "doctor_expi": 11,
            "doctor_dep": "Paediatrics",
            "doctor_aos": "Paediatrics",
            "doctor_qual": "PhD",
            "doctor_pincode": "5231GGG"
        }
    }
}
```

## Count Doctor Table Rows

URL

http://localhost:5000/api/doctor/selectdoctor/count

Response

```json
{
  "status": "Success",
  "data": {
    "rows": "12"
  }
}
```

## Retrieve Multiple Doctors

URL

http://localhost:5000/api/doctor/selectdoctor

Response

```json
{
  "status": "Success",
  "data": {
    "doctors": [
      {
        "user_id": "3",
        "user_name": "doc",
        "is_verified": false,
        "doc_expi": 0,
        "doc_dep": "Nan",
        "doc_aos": "Nan",
        "doc_qual": "Nan",
        "doc_address": "Nan",
        "doc_hos_id": null
      },
      {
        "user_id": "4",
        "user_name": "docc",
        "is_verified": false,
        "doc_expi": 0,
        "doc_dep": "Nan",
        "doc_aos": "Nan",
        "doc_qual": "Nan",
        "doc_address": "Nan",
        "doc_hos_id": "2"
      },
      {
        "user_id": "5",
        "user_name": "mull",
        "is_verified": false,
        "doc_expi": 0,
        "doc_dep": "Nan",
        "doc_aos": "Nan",
        "doc_qual": "Nan",
        "doc_address": "Nan",
        "doc_hos_id": "2"
      },
      {
        "user_id": "8",
        "user_name": "ed",
        "is_verified": false,
        "doc_expi": 0,
        "doc_dep": "Nan",
        "doc_aos": "Nan",
        "doc_qual": "Nan",
        "doc_address": "Nan",
        "doc_hos_id": "2"
      },
      {
        "user_id": "11",
        "user_name": "sdds",
        "is_verified": false,
        "doc_expi": 23,
        "doc_dep": "312",
        "doc_aos": "23",
        "doc_qual": "32",
        "doc_address": "fdsdsdfa",
        "doc_hos_id": "2"
      }
    ]
  }
}
```

## Hospital

### Get Hospital Details

URL

https://localhost:5000/api/hospital/2

Response

```json
{
  "status": "Success",
  "data": {
    "user_info": {
      "user_id": "2",
      "user_phone": "072464535",
      "user_name": "Bihuta",
      "user_type": "hospital",
      "is_verified": false,
      "hos_phone": "072464535",
      "hos_type": "hospital",
      "hos_address": "567 Hu",
      "hos_pincode": "233123"
    }
  }
}
```

### Update Hospital Details

URL

https://localhost:5000/api/hospital/2/edit

```json
{
	"hospitalAddress": "5665 Narrow",
	"hospitalPincode": "67894"
}
```

Response

```json
{
  "status": "Edit successfull",
  "data": {
    "user_info": {
      "hos_id": "2",
      "hos_phone": "072464535",
      "hos_type": "hospital",
      "hos_address": "5665 Narrow",
      "hos_pincode": "67894"
    }
  }
}
```
