package com.flightBooking.FlightBookingSystem;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import platform.testcase.ResOp;
import platform.testcase.TestPlan;
import platform.testcase.YmlParser;

import java.io.File;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
public class MetaDataFront {

    @GetMapping("/api/getAllMetaData")
    public ResponseEntity<?> getAllMetaData(){
        List<MetaDataDto> dtos=   processMetadata();
        return ResponseEntity.ok(dtos);
    }


    public static List<MetaDataDto> processMetadata() {
        List<MetaDataDto> dtos=new ArrayList<>();
        try {


            File folder = new File("src/main/java/com/flightBooking/resource/");
            File[] files = folder.listFiles((dir, name) -> name.endsWith(".java"));
            Map<String,Object> values=new HashMap<>();
            if (files != null) {
                for (File file : files) {

                    String fileName = file.getName().replace(".java", "");

                    // Skip files with "Result" suffix
                    if (fileName.endsWith("Result")) {
                        continue;
                    }
                    values.put("resource",fileName);

                    String className = "com.flightBooking.resource."  + fileName;

                    Class<?> clazz = Class.forName(className);
                    Object instance = clazz.getDeclaredConstructor().newInstance();

                    // Access the getMetaData() method
                    Method getMetaDataMethod = clazz.getMethod("getMetaData");
                    Object metaData = getMetaDataMethod.invoke(instance);

                    // Access the getFieldsArray() method from metaData
                    Method getFieldsArrayMethod = metaData.getClass().getMethod("getFieldsArray");
                    Object[] fieldsArray = (Object[]) getFieldsArrayMethod.invoke(metaData);
                   //  System.out.println(fieldsArray);



                    List<Map<String, Object>> fieldsData = new ArrayList<>();



                    for (Object field : fieldsArray) {
                        Map<String, Object> fieldValues = new HashMap<>();
                        // Assuming `field` has methods `isRequired`, `getType`, and `getName`
                   //      System.out.println( field.getClass().getName());
                        java.lang.reflect.Field field1 = field.getClass().getDeclaredField("name");
                        String n= field1.getName();
                        java.lang.reflect.Field field2 = field.getClass().getDeclaredField("required");
                        String required= field2.getName();
                        java.lang.reflect.Field field3 = field.getClass().getDeclaredField("type");
                        String type=field3.getName();

                        Method isRequiredMethod = field.getClass().getMethod("isRequired");
                        boolean isRequired = (boolean) isRequiredMethod.invoke(field);
                        fieldValues.put(required,isRequired);


                        Method getTypeMethod = field.getClass().getMethod("getType");
                        String fieldType = (String) getTypeMethod.invoke(field);
                        fieldValues.put(type,fieldType);


                        Method getNameMethod = field.getClass().getMethod("getName");
                        String fieldName = (String) getNameMethod.invoke(field);
                        fieldValues.put(n,fieldName);

                        fieldsData.add(fieldValues);

                    }

                    values.put("filds",fieldsData);

                    for (Map.Entry<String, Object> entry : values.entrySet()) {
                        String key = entry.getKey();
                        Object value = entry.getValue();

                        // Print or process the key-value pairs
                        System.out.println("Key: " + key + ", Value: " + value);
                    }
MetaDataDto dto=new MetaDataDto();
                    dto.setResource(fileName);
                    dto.setFieldValues(fieldsData);
                    dtos.add(dto);

                }
            }


        } catch (Exception e) {
            e.printStackTrace();
            // Handle exception as needed, e.g., log it or throw a custom exception
        }

        return dtos;
    }
}